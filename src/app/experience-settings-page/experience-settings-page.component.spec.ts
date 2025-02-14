import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienceSettingsPageComponent } from './experience-settings-page.component';

describe('ExperienceSettingsPageComponent', () => {
  let component: ExperienceSettingsPageComponent;
  let fixture: ComponentFixture<ExperienceSettingsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperienceSettingsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperienceSettingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
