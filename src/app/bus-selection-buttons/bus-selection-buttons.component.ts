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
  @Output() updatedUsedBuses = new EventEmitter<[string[], string]>
  @Input() index !: number;
  @Input() usedBuses !: Map<string, string[]>;
  @Input() time!: string;
  isChecked(value: string): boolean {
    // console.log(this.selectedOptions)
    if(this.selectedOptions.length == 0 || this.selectedOptions[this.index].length == 0) return false
    return this.selectedOptions[this.index].includes(value);
  }

  constructor() {

  }

  isDisabled(busId: string){
    for(const entry of this.usedBuses.entries()){
      if(entry[0] == this.time) continue
      for(const bus of entry[1]){
        if(busId == bus){
          return true
        }
      }
    }
    return false
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
    this.updatedUsedBuses.emit([this.selectedOptions[this.index], this.time])
    // Add your sorting logic here
  }

  protected readonly buses = buses;
}
