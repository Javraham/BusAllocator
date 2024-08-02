import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass, NgForOf} from "@angular/common";
import {buses} from "../typings/BusSelection";

@Component({
  selector: 'app-bus-selection-buttons',
  standalone: true,
  imports: [
    NgClass,
    NgForOf
  ],
  templateUrl: './bus-selection-buttons.component.html',
  styleUrl: './bus-selection-buttons.component.css'
})
export class BusSelectionButtonsComponent {
  @Input() selectedOptions!: string[][];
  @Output() updateCheckList = new EventEmitter<[string[], number]>
  @Input() index !: number;
  isChecked(value: string): boolean {
    if(this.selectedOptions.length == 0 || this.selectedOptions[this.index].length == 0) return false
    return this.selectedOptions[this.index].includes(value);
  }

  onCheckboxChange(event: any) {
    const value = event.target.value;
    if (event.target.checked) {
      this.selectedOptions[this.index].push(value);
    } else {
      this.selectedOptions[this.index] = this.selectedOptions[this.index].filter(v => v !== value);
    }
    this.updateCheckList.emit([this.selectedOptions[this.index], this.index])
  }

  sortPassengers() {
    // this.updateCheckList.emit(this.selectedOptions[this.index])
    console.log('Selected options:', this.selectedOptions[this.index]);
    // Add your sorting logic here
  }

  protected readonly buses = buses;
}
