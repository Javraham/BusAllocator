import { TestBed } from '@angular/core/testing';

import { EmailTemplatesService } from './email-templates.service';

describe('EmailTemplatesService', () => {
  let service: EmailTemplatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailTemplatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
