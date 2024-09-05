import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionObjectComponent } from './option-object.component';

describe('OptionObjectComponent', () => {
  let component: OptionObjectComponent;
  let fixture: ComponentFixture<OptionObjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionObjectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
