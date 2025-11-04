import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UploadDocs } from './features/upload-docs/upload-docs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('stmt-ai-app');
}
