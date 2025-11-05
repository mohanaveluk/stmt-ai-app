import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiUrlBuilder } from '../utility/api-url-builder';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  
    constructor(
    private http: HttpClient,
    private apiUrlBuilder: ApiUrlBuilder
  ) { }

  uploadFile(file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    const uploadUrl = this.apiUrlBuilder.buildApiUrl('upload');
    return this.http.post(uploadUrl, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

}
