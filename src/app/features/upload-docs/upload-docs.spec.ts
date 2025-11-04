import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDocs } from './upload-docs';

describe('UploadDocs', () => {
  let component: UploadDocs;
  let fixture: ComponentFixture<UploadDocs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadDocs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadDocs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
