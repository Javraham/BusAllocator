import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailAutomationComponent } from './email-automation.component';

describe('EmailAutomationComponent', () => {
  let component: EmailAutomationComponent;
  let fixture: ComponentFixture<EmailAutomationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailAutomationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailAutomationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
