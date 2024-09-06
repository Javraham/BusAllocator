import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickupsSettingsComponent } from './pickups-settings.component';

describe('PickupsSettingsComponent', () => {
  let component: PickupsSettingsComponent;
  let fixture: ComponentFixture<PickupsSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PickupsSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PickupsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
