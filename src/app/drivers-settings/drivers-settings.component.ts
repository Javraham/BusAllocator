import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { NgForOf, NgIf } from "@angular/common";
import { DriverObjectComponent } from "../driver-object/driver-object.component";
import { DriversService } from "../services/drivers.service";
import { IDriver } from "../typings/IDriver";

@Component({
    selector: 'app-drivers-settings',
    standalone: true,
    imports: [
        DriverObjectComponent,
        FormsModule,
        NgForOf,
        NgIf,
        ReactiveFormsModule
    ],
    templateUrl: './drivers-settings.component.html',
    styleUrl: './drivers-settings.component.css'
})
export class DriversSettingsComponent implements OnInit {
    driverForm: FormGroup = new FormGroup({
        name: new FormControl('', [Validators.required]),
        pin: new FormControl('', [Validators.required]),
        username: new FormControl('')
    });
    errorMsg = '';
    isEditingDriver = false;
    driverDocId: string | undefined = "";
    drivers: IDriver[] = [];
    isDriverFormOpen: boolean = false;

    constructor(private driversService: DriversService) {
    }

    ngOnInit() {
        this.driversService.getDrivers().subscribe({
            next: (response) => {
                this.drivers = response.data || [];
            },
            error: err => console.log(err)
        });
    }

    openNewDriverForm() {
        this.errorMsg = "";
        this.isDriverFormOpen = true;
        this.isEditingDriver = false;
        this.driverForm.reset();
    }

    addDriver() {
        if (this.driverForm.valid) {
            this.errorMsg = "";
            this.driversService.addDriver({
                name: this.driverForm.value.name,
                pin: this.driverForm.value.pin,
                username: this.driverForm.value.username,
                isAdmin: false
            }).subscribe({
                next: response => {
                    this.drivers.push(response.data);
                    this.isDriverFormOpen = false;
                },
                error: err => this.errorMsg = err.message
            })
            this.driverForm.reset();
        }
        else {
            this.errorMsg = "! Please fill in the Name and PIN fields";
            console.log('not valid');
        }
    }

    updateDriver() {
        if (this.driverForm.valid) {
            this.errorMsg = "";
            const driverToUpdate = this.drivers.find(d => d.docId === this.driverDocId);
            this.driversService.updateDriver({
                docId: this.driverDocId,
                name: this.driverForm.value.name,
                pin: this.driverForm.value.pin,
                username: this.driverForm.value.username,
                isAdmin: driverToUpdate?.isAdmin || false
            }).subscribe({
                next: response => {
                    const driverFound = this.drivers.find(d => response.data.docId === d.docId)
                    if (driverFound) {
                        driverFound.name = response.data.name;
                        driverFound.pin = response.data.pin;
                        driverFound.username = response.data.username;
                        driverFound.isAdmin = response.data.isAdmin;
                    }
                    this.isDriverFormOpen = false;
                },
                error: err => this.errorMsg = err.message
            })
            this.driverForm.reset();
        }
        else {
            this.errorMsg = "! Please fill in the Name and PIN fields";
        }
    }

    cancelDriver() {
        this.driverForm.reset();
        this.isDriverFormOpen = false;
    }

    editDriver(driverObject: IDriver) {
        this.errorMsg = "";
        this.driverDocId = driverObject.docId;
        this.isDriverFormOpen = true;
        this.isEditingDriver = true;

        this.driverForm.patchValue({
            name: driverObject.name,
            pin: driverObject.pin,
            username: driverObject.username
        });
    }

    deleteDriver() {
        this.driversService.deleteDriver(this.driverDocId || "").subscribe({
            next: response => {
                // Handling response consistent with assuming response returns the deleted object or we just remove by ID
                const index = this.drivers.findIndex(d => d.docId === (response.docId || this.driverDocId));
                if (index !== -1) {
                    this.drivers.splice(index, 1);
                }
                this.isDriverFormOpen = false;
            },
            error: err => this.errorMsg = err.message
        })
    }

    changeAdminStatus(eventData: { event: any, driver: IDriver }) {
        eventData.driver.isAdmin = eventData.event.target.checked;

        this.driversService.updateDriver(eventData.driver).subscribe({
            next: response => console.log('Admin status updated', response),
            error: err => console.error('Error updating admin status', err)
        });
    }
}
