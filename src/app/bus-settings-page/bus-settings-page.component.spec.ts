import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusSettingsPageComponent } from './bus-settings-page.component';

describe('BusSettingsPageComponent', () => {
  let component: BusSettingsPageComponent;
  let fixture: ComponentFixture<BusSettingsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusSettingsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusSettingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
