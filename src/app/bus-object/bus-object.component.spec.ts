import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusObjectComponent } from './bus-object.component';

describe('BusObjectComponent', () => {
  let component: BusObjectComponent;
  let fixture: ComponentFixture<BusObjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusObjectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
