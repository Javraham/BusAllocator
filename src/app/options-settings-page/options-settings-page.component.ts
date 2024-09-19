import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {OptionObjectComponent} from "../option-object/option-object.component";
import {OptionsService} from "../services/options.service";
import {IBookingOptions} from "../typings/IBookingOptions";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {IBus} from "../typings/BusSelection";
import {ISettingOptionsInput} from "../typings/ISettingOptionsInput";

@Component({
  selector: 'app-options-settings-page',
  standalone: true,
  imports: [
    NgForOf,
    OptionObjectComponent,
    FormsModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './options-settings-page.component.html',
  styleUrl: './options-settings-page.component.css'
})
export class OptionsSettingsPageComponent implements OnInit{

  options !: IBookingOptions[];
  optionsForm: FormGroup = new FormGroup<any>({
    option: new FormControl('', Validators.required),
    abbrev: new FormControl('', Validators.required),
    priority: new FormControl('', Validators.required)
  })
  errorMsg = '';
  isEditingOption = false;
  optionDocId: string | undefined = "";
  isOptionFormOpen: boolean = false;

  constructor(private optionsService: OptionsService) {
  }

  ngOnInit(){
    this.optionsService.getOptions().subscribe({
      next: (response) => {
        this.options = response.data.sort((a: IBookingOptions, b: IBookingOptions) => {
          return a.priority - b.priority
        })
        console.log(response.data)
      },
      error: err => console.log(err)
    })
  }

  openNewOptionForm(){
    this.errorMsg = "";
    this.isOptionFormOpen = true
    this.isEditingOption = false
    this.optionsForm.reset()
  }

  cancelNewOption() {
    this.optionsForm.reset()
    this.isOptionFormOpen = false
  }

  addNewOption() {
    if(this.optionsForm.valid){
      this.errorMsg = "";
      this.optionsService.addOption({option: this.optionsForm.value.option, abbrev: this.optionsForm.value.abbrev, priority: this.optionsForm.value.priority}).subscribe({
        next: response => {
          this.options.push(response.data)
          this.isOptionFormOpen = false
        },
        error: err => this.errorMsg = err.message
      })
      this.optionsForm.reset()
    }
    else{
      this.errorMsg = "! Please fill in the Bokun Name and Custome Name"
      console.log('not valid')
    }
  }

  onSubmit() {
    if(this.optionsForm.valid){
      console.log(this.optionsForm.value)
    }
  }

  deleteOption() {
    this.optionsService.deleteOption(this.optionDocId || "").subscribe({
      next: response => {
        const index = this.options.findIndex(bus => bus.docId === response.docId);
        if(index !== -1){
          this.options.splice(index, 1)
        }
        this.isOptionFormOpen = false
      },
      error: err => this.errorMsg = err.message
    })
  }

  updateOption() {
    if(this.optionsForm.valid){
      this.errorMsg = "";
      this.optionsService.updateOption({docId: this.optionDocId, option: this.optionsForm.value.option, abbrev: this.optionsForm.value.abbrev, priority: this.optionsForm.value.priority}).subscribe({
        next: response => {
          const optionFound = this.options.find(option => response.data.docId === option.docId)
          if(optionFound){
            optionFound.option = response.data.option;
            optionFound.abbrev = response.data.abbrev;
            optionFound.priority = response.data.priority;
          }
          this.options.sort((a: IBookingOptions, b: IBookingOptions) => {
            return a.priority - b.priority
          })
          this.isOptionFormOpen = false
          console.log(response.data)
        },
        error: err => this.errorMsg = err.message
      })
      this.optionsForm.reset()
    }
    else{
      this.errorMsg = "! Please fill in the Bokun Name and Custom Name"
      console.log('not valid')
    }
  }

  editOption(optionObject: ISettingOptionsInput) {
    this.errorMsg = "";
    this.optionDocId = optionObject.docId
    this.isOptionFormOpen = true;
    this.isEditingOption = true;

    this.optionsForm.patchValue({
      option: optionObject.name,
      abbrev: optionObject.abbreviation,
      priority: optionObject.priority
    });
  }
}
