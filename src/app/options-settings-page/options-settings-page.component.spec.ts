import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsSettingsPageComponent } from './options-settings-page.component';

describe('OptionsSettingsPageComponent', () => {
  let component: OptionsSettingsPageComponent;
  let fixture: ComponentFixture<OptionsSettingsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionsSettingsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionsSettingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
