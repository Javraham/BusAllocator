import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusAutomationComponent } from './bus-automation.component';

describe('BusAutomationComponent', () => {
  let component: BusAutomationComponent;
  let fixture: ComponentFixture<BusAutomationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusAutomationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusAutomationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
