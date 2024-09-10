import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {IBus} from "../typings/BusSelection";
import {BusService} from "../services/bus.service";

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
export class BusSelectionButtonsComponent implements OnInit{
  @Input() selectedOptions !: Map<string, string[]>;
  @Output() updateCheckList = new EventEmitter<[string[], string]>
  @Output() updatedUsedBuses = new EventEmitter<[string[], string]>
  @Output() removeBuses = new EventEmitter<[string, number]>
  @Input() index !: number;
  @Input() usedBuses !: Map<string, string[]>;
  @Input() time!: string;
  @Input() successMap!: Map<string, [boolean, boolean]>;
  @Input() availBuses !: IBus[]
  canEdit: boolean = false;
  @Input() buses !: IBus[]

  ngOnInit(){

  }
  isChecked(value: string): boolean {
    const optionsForTime = this.selectedOptions.get(this.time);
    if (!optionsForTime || optionsForTime.length === 0) return false;
    return optionsForTime.includes(value) && !this.isDisabled(value);
  }

  constructor(private busService: BusService) {
  }

  isDisabled(busId: string){
    console.log(this.usedBuses.entries())
    for(const entry of this.selectedOptions.entries()){
      if(entry[0] == this.time) continue
      for(const bus of entry[1]){
        if(busId == bus){
          return true
        }
      }
    }
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
    this.updateCheckList.emit([this.selectedOptions.get(this.time) || [], this.time]);
  }

  sortPassengers() {
    this.updatedUsedBuses.emit([this.selectedOptions.get(this.time) || [], this.time]);
  }


  resetBuses() {
    this.removeBuses.emit([this.time, this.index])
  }

  selectAll() {
    const usedBuses = Array.from(this.usedBuses).filter(val => val[0] !== this.time).map(val => val[1]).flat()
    console.log(usedBuses)
    this.updateCheckList.emit([this.buses.map(val => val.busId).filter(busId=> !usedBuses.includes(busId)) || [], this.time]);
  }

}
