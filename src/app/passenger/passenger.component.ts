import { Component } from '@angular/core';
import {TourOrganizerService} from "../services/tour-organizer.service";
import {TourOrganizer} from "../services/organizer";
import {Passenger} from "../typings/passenger";
import {Input} from "@angular/core";
import {NgIf, NgStyle} from "@angular/common";

@Component({
  selector: 'app-passenger',
  standalone: true,
  imports: [
    NgIf,
    NgStyle
  ],
  templateUrl: './passenger.component.html',
  styleUrl: './passenger.component.css'
})
export class PassengerComponent {
  @Input() passengerInfo !: Passenger;
  @Input() busColor !: string;
  constructor(private tourOrganizer: TourOrganizerService) {
  }


  getStyles() {
    return {
      'border-left': "10px solid " + this.busColor
    }
  }
}
