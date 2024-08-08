import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {buses} from "../typings/BusSelection";

@Component({
  selector: 'app-bus-selection-buttons',
  standalone: true,
  imports: [
    NgClass,
    NgForOf,
    NgIf
  ],
  templateUrl: './bus-selection-buttons.component.html',
  styleUrl: './bus-selection-buttons.component.css'
})
export class BusSelectionButtonsComponent {
  @Input() selectedOptions !: Map<string, string[]>;
  @Output() updateCheckList = new EventEmitter<[string[], string]>
  @Output() updatedUsedBuses = new EventEmitter<[string[], string]>
  @Output() removeBuses = new EventEmitter<[string, number]>
  @Input() index !: number;
  @Input() usedBuses !: Map<string, string[]>;
  @Input() time!: string;
  @Input() successMap!: Map<string, boolean>;

  isChecked(value: string): boolean {
    const optionsForTime = this.selectedOptions.get(this.time);
    if (!optionsForTime || optionsForTime.length === 0) return false;
    return optionsForTime.includes(value);
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
    const optionsForTime = this.selectedOptions.get(this.time) || [];

    if (event.target.checked) {
      optionsForTime.push(value);
      this.selectedOptions.set(this.time, optionsForTime)
    } else {
      this.selectedOptions.set(this.time, optionsForTime.filter(v => v !== value));
    }
    console.log(this.selectedOptions)
    this.updateCheckList.emit([this.selectedOptions.get(this.time) || [], this.time]);
  }

  sortPassengers() {
    this.updatedUsedBuses.emit([this.selectedOptions.get(this.time) || [], this.time]);
    console.log(this.successMap);
  }

  protected readonly buses = buses;

  resetBuses() {
    this.removeBuses.emit([this.time, this.index])
  }
}
