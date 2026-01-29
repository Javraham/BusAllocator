import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IDriver } from '../typings/IDriver';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-driver-object',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './driver-object.component.html',
    styleUrl: './driver-object.component.css'
})
export class DriverObjectComponent {
    @Input() driverObject!: IDriver;
    @Output() editDriver = new EventEmitter<IDriver>();
    @Output() adminChange = new EventEmitter<{ event: any, driver: IDriver }>();

    sendDriverObjectToParent() {
        this.editDriver.emit(this.driverObject);
    }

    onAdminChange(event: any) {
        this.adminChange.emit({ event, driver: this.driverObject });
    }
}
