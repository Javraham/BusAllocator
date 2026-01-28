import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToursSettingsComponent } from './tours-settings.component';

describe('ToursSettingsComponent', () => {
    let component: ToursSettingsComponent;
    let fixture: ComponentFixture<ToursSettingsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ToursSettingsComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ToursSettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
