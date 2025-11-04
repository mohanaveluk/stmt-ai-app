import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'upload',
        loadComponent: () => import('./features/upload-docs/upload-docs').then(m => m.UploadDocs),
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    }
];
