import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusSelectionButtonsComponent } from './bus-selection-buttons.component';

describe('BusSelectionButtonsComponent', () => {
  let component: BusSelectionButtonsComponent;
  let fixture: ComponentFixture<BusSelectionButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusSelectionButtonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusSelectionButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
