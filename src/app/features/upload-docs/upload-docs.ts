import { Component } from '@angular/core';
import { FileUpload } from '../../widgets/file-upload/file-upload';
import { SharedCommonModule, SharedMaterialModule } from '../../shared/modules';

@Component({
  selector: 'app-upload-docs',
  imports: [
    SharedCommonModule,
    SharedMaterialModule,
    FileUpload
],
  templateUrl: './upload-docs.html',
  styleUrl: './upload-docs.scss',
})
export class UploadDocs {

}
