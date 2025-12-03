import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {OptionObjectComponent} from "../option-object/option-object.component";
import {PickupsService} from "../services/pickups.service";
import {EmailTemplate, IPickup} from "../typings/ipickup";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {OptionsService} from "../services/options.service";
import {IBookingOptions} from "../typings/IBookingOptions";
import {ISettingOptionsInput} from "../typings/ISettingOptionsInput";
import {EmailTemplatesService} from "../services/email-templates.service";

@Component({
  selector: 'app-email-template-settings',
  standalone: true,
  imports: [
    NgForOf,
    OptionObjectComponent,
    FormsModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './email-templates.component.html',
  styleUrl: './email-templates-settings.component.css'
})
export class EmailTemplatesComponent implements OnInit{

  emailTemplates !: EmailTemplate[];
  templateForm: FormGroup = new FormGroup<any>({
    name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    whatsappTemplate: new FormControl('')
  })

  errorMsg = '';
  isEditingTemplate = false;
  templateDocId: string | undefined = "";
  isTemplateFormOpen: boolean = false;

  openNewEmailTemplateForm(){
    this.errorMsg = "";
    this.isTemplateFormOpen = true
    this.isEditingTemplate = false
    this.templateForm.reset()
  }

  cancelNewEmailTemplate() {
    this.templateForm.reset()
    this.isTemplateFormOpen = false
  }

  addNewTemplate() {
    if(this.templateForm.valid){
      console.log(this.templateForm.value)
      this.errorMsg = "";
      this.emailTemplatesService.addTemplate({email: this.templateForm.value.email, name: this.templateForm.value.name, whatsappTemplate: this.templateForm.value.whatsappTemplate}).subscribe({
        next: response => {
          this.emailTemplates.push(response.data)
          this.isTemplateFormOpen = false
        },
        error: err => this.errorMsg = err.message
      })
      this.templateForm.reset()
    }
    else{
      this.errorMsg = "! Please fill in the template name and email"
      console.log('not valid')
    }
  }

  deleteTemplate() {
    this.emailTemplatesService.deleteTemplate(this.templateDocId || "").subscribe({
      next: response => {
        const index = this.emailTemplates.findIndex(template => template.docId === response.docId);
        if(index !== -1){
          this.emailTemplates.splice(index, 1)
        }
        this.isTemplateFormOpen = false
      },
      error: err => this.errorMsg = err.message
    })
  }

  updateTemplate() {
    if(this.templateForm.valid){
      this.errorMsg = "";
      this.emailTemplatesService.updateTemplate({docId: this.templateDocId, name: this.templateForm.value.name, email: this.templateForm.value.email, whatsappTemplate: this.templateForm.value.whatsappTemplate}).subscribe({
        next: response => {
          const templateFound = this.emailTemplates.find(template => response.data.docId === template.docId)
          if(templateFound){
            templateFound.name = response.data.name;
            templateFound.email = response.data.email;
            templateFound.whatsappTemplate = response.data.whatsappTemplate
          }
          this.isTemplateFormOpen = false
          this.templateForm.reset()
          console.log(response.data)
        },
        error: err => {
          this.errorMsg = err.message
          this.templateForm.reset()
        }

      })
    }
    else{
      this.errorMsg = "! Please fill in the Template Name and Email"
      console.log('not valid')
    }
  }

  editTemplate(templateObject: ISettingOptionsInput) {
    this.errorMsg = "";
    this.templateDocId = templateObject.docId
    this.isTemplateFormOpen = true;
    this.isEditingTemplate = true;

    const template = this.emailTemplates.find(t => t.docId === templateObject.docId);
    this.templateForm.patchValue({
      name: templateObject.name,
      email: templateObject.emailTemplateBody,
      whatsappTemplate: template?.whatsappTemplate || ''
    });
  }
  constructor(private emailTemplatesService: EmailTemplatesService) {
  }

  ngOnInit() {
    this.emailTemplatesService.getEmailTemplates().subscribe({
      next: (response) => {
        this.emailTemplates = response.data
        console.log(response.data)
      },
      error: err => console.log(err)
    })
  }
}
