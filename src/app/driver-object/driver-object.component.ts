import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IDriver } from '../typings/IDriver';
import { NgStyle } from '@angular/common';

@Component({
    selector: 'app-driver-object',
    standalone: true,
    imports: [NgStyle],
    templateUrl: './driver-object.component.html',
    styleUrl: './driver-object.component.css'
})
export class DriverObjectComponent {
    @Input() driverObject!: IDriver;
    @Output() editDriver = new EventEmitter<IDriver>();

    sendDriverObjectToParent() {
        this.editDriver.emit(this.driverObject);
    }
}
