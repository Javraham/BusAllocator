import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgClass, NgForOf, NgIf } from "@angular/common";
import { IBus } from "../typings/BusSelection";
import { BusService } from "../services/bus.service";
import { IDriver } from "../typings/IDriver";

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
export class BusSelectionButtonsComponent implements OnInit {
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

  // Driver assignment inputs/outputs
  @Input() drivers: IDriver[] = [];
  @Input() busToDriverMap !: Map<string, string>;
  @Output() driverAssigned = new EventEmitter<{ busId: string, driverId: string, time: string }>();

  ngOnInit() {

  }

  // TrackBy function
  trackByBusId(index: number, bus: IBus): string {
    return bus.busId;
  }

  isChecked(value: string): boolean {
    const optionsForTime = this.selectedOptions.get(this.time);
    if (!optionsForTime || optionsForTime.length === 0) return false;
    return optionsForTime.includes(value) && !this.isDisabled(value);
  }

  constructor(private busService: BusService) {
  }

  isDisabled(busId: string) {
    for (const entry of this.selectedOptions.entries()) {
      if (entry[0] == this.time) continue
      for (const bus of entry[1]) {
        if (busId == bus) {
          return true
        }
      }
    }
    for (const entry of this.usedBuses.entries()) {
      if (entry[0] == this.time) continue
      for (const bus of entry[1]) {
        if (busId == bus) {
          return true
        }
      }
    }

    return false
  }

  // Replaced logic to fix scroll bug (no event.preventDefault needed for div/button click)
  toggleBus(busId: string) {
    if (this.isDisabled(busId)) return;

    const optionsForTime = this.selectedOptions.get(this.time) || [];

    if (optionsForTime.includes(busId)) {
      this.selectedOptions.set(this.time, optionsForTime.filter(v => v !== busId));
    } else {
      optionsForTime.push(busId);
      this.selectedOptions.set(this.time, optionsForTime)
    }
    this.updateCheckList.emit([this.selectedOptions.get(this.time) || [], this.time]);
  }

  sortPassengers(event: Event) {
    event.preventDefault();
    // Emit a COPY of the array to prevent reference sharing with usedBuses
    const selectedBuses = this.selectedOptions.get(this.time) || [];
    this.updatedUsedBuses.emit([[...selectedBuses], this.time]);
  }

  resetBuses(event: Event) {
    event.preventDefault();
    this.removeBuses.emit([this.time, this.index])
  }

  selectAll(event: Event) {
    event.preventDefault();
    const usedBuses = Array.from(this.usedBuses).filter(val => val[0] !== this.time).map(val => val[1]).flat()
    console.log(usedBuses)
    this.updateCheckList.emit([this.buses.map(val => val.busId).filter(busId => !usedBuses.includes(busId)) || [], this.time]);
  }
}
