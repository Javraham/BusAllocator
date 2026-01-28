import { Component, OnInit } from '@angular/core';
import { NgForOf, NgIf } from "@angular/common";
import { OptionObjectComponent } from "../option-object/option-object.component";
import { ToursService } from "../services/tours.service";
import { ITour } from "../typings/itour";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ISettingOptionsInput } from "../typings/ISettingOptionsInput";

@Component({
    selector: 'app-tours-settings',
    standalone: true,
    imports: [
        NgForOf,
        OptionObjectComponent,
        FormsModule,
        NgIf,
        ReactiveFormsModule
    ],
    templateUrl: './tours-settings.component.html',
    styleUrl: './tours-settings.component.css'
})
export class ToursSettingsComponent implements OnInit {

    tours !: ITour[];
    toursForm: FormGroup = new FormGroup<any>({
        time: new FormControl('', Validators.required),
        tourName: new FormControl('', Validators.required)
    })
    errorMsg = '';
    isEditingTour = false;
    tourDocId: string | undefined = "";
    isTourFormOpen: boolean = false;


    openNewTourForm() {
        this.errorMsg = "";
        this.isTourFormOpen = true
        this.isEditingTour = false
        this.toursForm.reset()
    }

    cancelNewTour() {
        this.toursForm.reset()
        this.isTourFormOpen = false
    }

    addNewTour() {
        if (this.toursForm.valid) {
            console.log(this.toursForm.value)
            this.errorMsg = "";
            this.toursService.addTour({ time: this.toursForm.value.time, tourName: this.toursForm.value.tourName }).subscribe({
                next: response => {
                    this.tours.push(response.data)
                    this.isTourFormOpen = false
                },
                error: err => this.errorMsg = err.message
            })
            this.toursForm.reset()
        }
        else {
            this.errorMsg = "! Please fill in the Time and Tour Name"
            console.log('not valid')
        }
    }


    deleteTour() {
        this.toursService.deleteTour(this.tourDocId || "").subscribe({
            next: response => {
                const index = this.tours.findIndex(tour => tour.docId === response.docId);
                if (index !== -1) {
                    this.tours.splice(index, 1)
                }
                this.isTourFormOpen = false
            },
            error: err => this.errorMsg = err.message
        })
    }

    updateTour() {
        if (this.toursForm.valid) {
            this.errorMsg = "";
            this.toursService.updateTour({ docId: this.tourDocId, time: this.toursForm.value.time, tourName: this.toursForm.value.tourName }).subscribe({
                next: response => {
                    const tourFound = this.tours.find(tour => response.data.docId === tour.docId)
                    if (tourFound) {
                        tourFound.time = response.data.time;
                        tourFound.tourName = response.data.tourName;
                    }
                    this.isTourFormOpen = false
                    this.toursForm.reset()
                    console.log(response.data)
                },
                error: err => {
                    this.errorMsg = err.message
                    this.toursForm.reset()
                }

            })
        }
        else {
            this.errorMsg = "! Please fill in the Time and Tour Name"
            console.log('not valid')
        }
    }

    editTour(tourObject: ISettingOptionsInput) {
        this.errorMsg = "";
        this.tourDocId = tourObject.docId
        this.isTourFormOpen = true;
        this.isEditingTour = true;

        this.toursForm.patchValue({
            time: tourObject.time,
            tourName: tourObject.name
        });
    }
    constructor(private toursService: ToursService) {
    }

    ngOnInit() {
        this.toursService.getTours().subscribe({
            next: (response) => {
                this.tours = response.data
                console.log(response.data)
            },
            error: err => console.log(err)
        })
    }
}
