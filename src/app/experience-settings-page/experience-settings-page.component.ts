import {Component, OnInit} from '@angular/core';
import {ExperiencesService} from "../services/experiences.service";
import {IExperience} from "../typings/ipickup";
import {NgForOf, NgIf} from "@angular/common";
import {BusObjectComponent} from "../bus-object/bus-object.component";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {IBus} from "../typings/BusSelection";

@Component({
  selector: 'app-experience-settings-page',
  standalone: true,
  imports: [
    NgForOf,
    BusObjectComponent,
    NgIf,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './experience-settings-page.component.html',
  styleUrl: './experience-settings-page.component.css'
})
export class ExperienceSettingsPageComponent implements OnInit{
  experienceForm: FormGroup = new FormGroup<any>({
    experienceId: new FormControl('', [Validators.required])
  })
  errorMsg = '';
  isEditingExperience = false;
  experienceChosen !: IExperience;
  buses !: IBus[];
  isExperienceFormOpen: boolean = false;
  experiences: IExperience[] = [];
  constructor(private experienceService: ExperiencesService) {}

  ngOnInit(): void {
    this.experienceService.getExperiences().subscribe({
      next: (response) => this.experiences = response.data.sort((a: IExperience, b: IExperience) => + b.isSelected - + a.isSelected),
      error: (e) => console.log(e)
    })
  }

  openNewExperienceForm(){
    this.errorMsg = "";
    this.isExperienceFormOpen = true
    this.isEditingExperience = false
    this.experienceForm.reset()
  }

  changeSelection(event: any, experience: IExperience) {
    experience.isSelected = event.target.checked;

    this.experienceService.updateExperience(experience).subscribe({
      next: (response) => console.log(response),
      error: (e) => console.log(e)
    })

    console.log(this.experiences)
  }

  addExperience(event: any) {
    if(this.experienceForm.valid){
      this.errorMsg = "";
      this.experienceService.addExperience({isSelected: true, experienceId: this.experienceForm.value.experienceId}).subscribe({
        next: response => {
          this.experiences = [...this.experiences, response.data]
          this.isExperienceFormOpen = false
        },
        error: err => this.errorMsg = err.message
      })
      this.experienceForm.reset()
    }
    else{
      this.errorMsg = "! Please fill in the Experience ID"
      console.log('not valid')
    }
  }

  updateExperience() {
    if(this.experienceForm.valid){
      this.errorMsg = "";
      this.experienceService.updateExperience({docId: this.experienceChosen.docId, isSelected: this.experienceChosen.isSelected, experienceId: this.experienceForm.value.experienceId}).subscribe({
        next: response => {
          const experienceFound = this.experiences.find(experience => response.data.docId === experience.docId)
          if(experienceFound){
            experienceFound.experienceId = response.data.experienceId;
          }
          this.isExperienceFormOpen = false
          console.log(response.data)
        },
        error: err => this.errorMsg = err.message
      })
      this.experienceForm.reset()
    }
    else{
      this.errorMsg = "! Please fill in the Experience ID"
      console.log('not valid')
    }
  }

  deleteExperience() {
    this.experienceService.deleteExperience(this.experienceChosen.docId || "").subscribe({
      next: response => {
        const index = this.experiences.findIndex(experience => experience.docId === response.docId);
        if(index !== -1){
          this.experiences.splice(index, 1)
        }
        this.isExperienceFormOpen = false
      },
      error: err => this.errorMsg = err.message
    })
  }

  editExperience(experience: IExperience) {
    this.errorMsg = "";
    this.isExperienceFormOpen = true;
    this.isEditingExperience = true;
    this.experienceChosen = experience;

    this.experienceForm.patchValue({
      experienceId: experience.experienceId,
    });
  }

  cancelExperience() {
    this.experienceForm.reset();
    this.isExperienceFormOpen = false;
  }

}
