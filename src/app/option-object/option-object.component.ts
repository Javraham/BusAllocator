import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ISettingOptionsInput} from "../typings/ISettingOptionsInput";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-option-object',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './option-object.component.html',
  styleUrl: './option-object.component.css'
})
export class OptionObjectComponent {
  @Input() optionsInput !: ISettingOptionsInput;
  @Output() openEdit = new EventEmitter<ISettingOptionsInput>();

  openEditOptionForm() {
    this.openEdit.emit(this.optionsInput)
  }
}
