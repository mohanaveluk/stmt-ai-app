import { Component, Input, ViewChild, ElementRef } from "@angular/core";
import {DomSanitizer } from "@angular/platform-browser";

import { SharedCommonModule, SharedMaterialModule } from "../../shared/modules";
import { HttpClient, HttpEventType } from "@angular/common/http";


@Component({
  selector: 'app-file-upload',
  imports: [
    SharedCommonModule,
    SharedMaterialModule
    ,],
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.scss',
})
export class FileUpload {
  //https://stackblitz.com/edit/angular-material-fileupload
  private apiUrl = "http://localhost:3000/api/v1/upload";
  fieldName: string = 'file';
  uploadStatus: string = '';
  
  @Input()
  mode: any
  @Input()
  names: any
  @Input()
  url: any
  @Input()
  method: any
  @Input()
  multiple: any = "multiple"
  @Input()
  disabled: any
  @Input()
  accept: any
  @Input()
  maxFileSize: any
  @Input()
  auto = true
  @Input()
  withCredentials: any
  @Input()
  invalidFileSizeMessageSummary: any
  @Input()
  invalidFileSizeMessageDetail: any
  @Input()
  invalidFileTypeMessageSummary: any
  @Input()
  invalidFileTypeMessageDetail: any
  @Input()
  previewWidth: any
  @Input()
  chooseLabel = 'Choose'
  @Input()
  uploadLabel = 'Upload'
  @Input()
  cancelLabel = 'Cance'
  @Input()
  customUpload: any
  @Input()
  showUploadButton: any
  @Input()
  showCancelButton: any


  @Input()
  dataUriPrefix: any
  @Input()
  deleteButtonLabel: any
  @Input()
  deleteButtonIcon = 'close'
  @Input()
  showUploadInfo: any

  /**
   *
   */


  @ViewChild('fileUpload')
  fileUpload: any = ElementRef<HTMLInputElement>

  inputFileName: string = ""

  @Input()
  files: File[] = []
  uploadFiles: File[] = []
  // Track upload status per file (matched by name+lastModified)
  uploadStatuses: Array<{ name: string; lastModified: number; progress: number; status: string }> = []

  constructor(
    private sanitizer: DomSanitizer,
    private httpClient: HttpClient) {
  }

  onClick(event: any) {
    if (this.fileUpload)
      this.fileUpload.nativeElement.click()
  }

  onInput(event: any) {

  }

  onFileSelected(event: any) {
    // make selection handler asynchronous so we can await uploads one-by-one
    (async () => {
      const files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
      console.log('event::::::', event);
      for (let i = 0; i < files.length; i++) {
        const file: File = files[i];

        if (this.validate(file)) {
          // create preview URL (attach as a non-standard property for template use)
          // (TypeScript's File type doesn't include objectURL, but templates can still read it)
          (file as any).objectURL = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(file)));

          if (!this.isMultiple()) {
            this.files = [];
          }

          // add to selected list immediately
          this.files.push(file);

          // if auto-upload is enabled, upload sequentially (await)
          if (this.auto) {
            try {
              await this.uploadDocument1(file);
            } catch (err) {
              // uploadDocument will already log details; keep going to next file
              console.error('Sequential upload failed for', file.name, err);
            }
          }
        }
      }
    })();
  }

  removeFile(event: Event, file: File) {
    let ix
    if (this.files && -1 !== (ix = this.files.indexOf(file))) {
      this.files.splice(ix, 1)
      this.clearInputElement()
      // remove status if present
      const si = this.uploadStatuses.findIndex(s => s.name === file.name && s.lastModified === file.lastModified);
      if (si !== -1) this.uploadStatuses.splice(si, 1);
    }
  }

  validate(file: File) {
    for (const f of this.files) {
      if (f.name === file.name
        && f.lastModified === file.lastModified
        && f.size === f.size
        && f.type === f.type
      ) {
        return false
      }
    }
    return true
  }

  uploadDocument(fileObj: File) {
    // Use HttpClient to send the formData to the server
    console.log('Uploading files:', this.files);


    //multipart/form-data
    // Upload logic is now in uploadDocument1 (kept for backwards compatibility) or
    // you can call uploadDocument which returns a Promise.
  }


  
  async uploadDocument1(fileObj: File) : Promise<void> {
    // Use HttpClient to send the formData to the server
    console.log('Uploading files:', this.files);
    // multipart/form-data
    // Use a provided `url` input if present, otherwise fall back to component apiUrl
    const uploadUrl = this.url || this.apiUrl;

    const formData = new FormData();
    // Use only the configured field name to avoid sending unexpected fields
    // which can trigger server-side validation errors (e.g. multer's
    // "Unexpected field"). Set `fieldName` input to 'file' or 'files' to match
    // whatever the backend expects.
    const field = this.fieldName || 'file';
    formData.append(field, fileObj, fileObj.name);
    // Also include metadata if helpful (optional)
    formData.append('filename', fileObj.name);

    const fileStatus = { name: fileObj.name, lastModified: fileObj.lastModified, progress: 0, status: 'pending' };
    // You can track fileStatus to update progress and status
    this.uploadFiles.push(fileObj);
    this.uploadStatuses.push({ name: fileStatus.name, lastModified: fileStatus.lastModified, progress: 0, status: 'pending' });

    this.httpClient.post(uploadUrl, formData, {
      reportProgress: true,
      observe: 'events',
      // Do NOT set Content-Type header manually for FormData — the browser will
      // set the required boundary. If you set it manually you will break the request.
    }).subscribe(event => {
      // Handle upload progress and response here
      console.log('Upload event:', event);
      if (event.type === HttpEventType.UploadProgress && event.total) {
        // Upload progress event
        const progress = Math.round((100 * event.loaded) / event.total);
        fileStatus.progress = progress;
        fileStatus.status = 'in-progress';
        // update tracked status
        const s = this.uploadStatuses.find(u => u.name === fileStatus.name && u.lastModified === fileStatus.lastModified);
        if (s) { s.progress = progress; s.status = 'in-progress'; }
      } else if (event.type === HttpEventType.Response) {
        // Upload completed successfully
        fileStatus.progress = 100;
        fileStatus.status = 'completed';
        // update tracked status
        const s = this.uploadStatuses.find(u => u.name === fileStatus.name && u.lastModified === fileStatus.lastModified);
        if (s) { s.progress = 100; s.status = 'completed'; }
        console.log('Upload response body:', event.body);
      }
    }, error => {
      // Handle upload error here — log status and body for debugging
      try {
        console.error('Upload failed', {
          url: uploadUrl,
          status: error.status,
          message: error.message,
          error: error.error
        });
      } catch (e) {
        console.error('Upload failed (error object not serializable)', error);
      }
      fileStatus.status = 'Failed to upload';
      // update tracked status
      const s = this.uploadStatuses.find(u => u.name === fileStatus.name && u.lastModified === fileStatus.lastModified);
      if (s) { s.status = 'failed'; }
    });
  }

  
  // helper used by the template to get status for a file
  getStatus(file: File) {
    return this.uploadStatuses.find(u => u.name === file.name && u.lastModified === file.lastModified) || { progress: 0, status: 'idle' };
  }

  // Format bytes into human-readable string (B, KB, MB)
  formatFileSize(bytes: number | undefined | null): string {
    if (bytes == null || isNaN(bytes as any)) return '';
    const b = Number(bytes);
    if (b < 1024) return `${b} B`;
    const kb = b / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    if (mb < 1024) return `${mb.toFixed(2)} MB`;
    const gb = mb / 1024;
    return `${gb.toFixed(2)} GB`;
  }

  clearInputElement() {
    this.fileUpload.nativeElement.value = ''
  }


  isMultiple(): boolean {
    return this.multiple
  }
}
