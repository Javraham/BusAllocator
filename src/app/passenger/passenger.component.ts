import {Component, ElementRef, ViewChild} from '@angular/core';
import {TourOrganizerService} from "../services/tour-organizer.service";
import {TourOrganizer} from "../services/organizer";
import {Passenger} from "../typings/passenger";
import {Input} from "@angular/core";
import {NgClass, NgIf, NgStyle} from "@angular/common";


@Component({
  selector: 'app-passenger',
  standalone: true,
  imports: [
    NgIf,
    NgStyle,
    NgClass
  ],
  templateUrl: './passenger.component.html',
  styleUrl: './passenger.component.css'
})
export class PassengerComponent {
  @Input() passengerInfo !: Passenger;
  @Input() busColor !: string;
  isActive: boolean = false;

  constructor(private tourOrganizer: TourOrganizerService) {
  }

  toggleButton() {
    this.isActive = !this.isActive;
  }

  getButtonStyles() {
    return {
      "border": "1px solid " + this.busColor,
      "color": this.busColor
    }
  }
  getStyles() {
    return {
      'border-left': "10px solid " + this.busColor
    }
  }
}
