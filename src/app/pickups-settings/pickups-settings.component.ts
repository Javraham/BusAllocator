import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {OptionObjectComponent} from "../option-object/option-object.component";
import {PickupsService} from "../services/pickups.service";
import {IPickup} from "../typings/ipickup";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {OptionsService} from "../services/options.service";
import {IBookingOptions} from "../typings/IBookingOptions";
import {ISettingOptionsInput} from "../typings/ISettingOptionsInput";

@Component({
  selector: 'app-pickups-settings',
  standalone: true,
  imports: [
    NgForOf,
    OptionObjectComponent,
    FormsModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './pickups-settings.component.html',
  styleUrl: './pickups-settings.component.css'
})
export class PickupsSettingsComponent implements OnInit{

  pickupLocations !: IPickup[];
  pickupsForm: FormGroup = new FormGroup<any>({
    name: new FormControl('', Validators.required),
    abbreviation: new FormControl('', Validators.required),
    whatsappTemplate: new FormControl(''),
    body: new FormControl('', Validators.required)
  })
  errorMsg = '';
  isEditingPickup = false;
  pickupDocId: string | undefined = "";
  isPickupFormOpen: boolean = false;


  openNewPickupForm(){
    this.errorMsg = "";
    this.isPickupFormOpen = true
    this.isEditingPickup = false
    this.pickupsForm.reset()
  }

  cancelNewPickup() {
    this.pickupsForm.reset()
    this.isPickupFormOpen = false
  }

  addNewPickup() {
    if(this.pickupsForm.valid){
      console.log(this.pickupsForm.value)
      this.errorMsg = "";
      this.pickupsService.addPickupLocation({emailTemplate: {body: this.pickupsForm.value.body}, name: this.pickupsForm.value.name, abbreviation: this.pickupsForm.value.abbreviation, whatsappTemplate: this.pickupsForm.value.whatsappTemplate}).subscribe({
        next: response => {
          this.pickupLocations.push(response.data)
          this.isPickupFormOpen = false
        },
        error: err => this.errorMsg = err.message
      })
      this.pickupsForm.reset()
    }
    else{
      this.errorMsg = "! Please fill in the Bokun Name and Custome Name"
      console.log('not valid')
    }
  }


  deleteOption() {
    this.pickupsService.deletePickupLocation(this.pickupDocId || "").subscribe({
      next: response => {
        const index = this.pickupLocations.findIndex(pickup => pickup.docId === response.docId);
        if(index !== -1){
          this.pickupLocations.splice(index, 1)
        }
        this.isPickupFormOpen = false
      },
      error: err => this.errorMsg = err.message
    })
  }

  updatePickup() {
    if(this.pickupsForm.valid){
      this.errorMsg = "";
      this.pickupsService.updatePickupLocation({docId: this.pickupDocId, name: this.pickupsForm.value.name, abbreviation: this.pickupsForm.value.abbreviation, emailTemplate: {body: this.pickupsForm.value.body}, whatsappTemplate: this.pickupsForm.value.whatsappTemplate}).subscribe({
        next: response => {
          const pickupFound = this.pickupLocations.find(pickup => response.data.docId === pickup.docId)
          if(pickupFound){
            pickupFound.name = response.data.name;
            pickupFound.abbreviation = response.data.abbreviation;
            pickupFound.emailTemplate = response.data.emailTemplate;
            pickupFound.whatsappTemplate = response.data.whatsappTemplate
          }
          this.isPickupFormOpen = false
          this.pickupsForm.reset()
          console.log(response.data)
        },
        error: err => {
          this.errorMsg = err.message
          this.pickupsForm.reset()
        }

      })
    }
    else{
      this.errorMsg = "! Please fill in the Bokun Name and Custom Name"
      console.log('not valid')
    }
  }

  editPickup(pickupObject: ISettingOptionsInput) {
    this.errorMsg = "";
    this.pickupDocId = pickupObject.docId
    this.isPickupFormOpen = true;
    this.isEditingPickup = true;

    const pickup = this.pickupLocations.find(p => p.docId === pickupObject.docId);
    this.pickupsForm.patchValue({
      name: pickupObject.name,
      abbreviation: pickupObject.abbreviation,
      body: pickupObject.emailTemplateBody,
      whatsappTemplate: pickup?.whatsappTemplate || ''
    });
  }
  constructor(private pickupsService: PickupsService) {
  }

  ngOnInit() {
    this.pickupsService.getPickupLocations().subscribe({
      next: (response) => {
        this.pickupLocations = response.data
        console.log(response.data)
      },
      error: err => console.log(err)
    })
  }
}
