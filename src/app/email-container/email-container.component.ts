import {Component, Input} from '@angular/core';
import {IEmail} from "../typings/IEmail";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-email-container',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './email-container.component.html',
  styleUrl: './email-container.component.css'
})
export class EmailContainerComponent {
  @Input() emailInfo !: IEmail;
  form: FormGroup = new FormGroup({
    to: new FormControl('', Validators.required),
    subject: new FormControl('', [Validators.required]),
    body: new FormControl('', [Validators.required])
  });

  sendEmail() {
    console.log(this.form.value)
  }
}
