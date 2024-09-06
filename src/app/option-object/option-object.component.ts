import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ISettingOptionsInput} from "../typings/ISettingOptionsInput";

@Component({
  selector: 'app-option-object',
  standalone: true,
  imports: [],
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
