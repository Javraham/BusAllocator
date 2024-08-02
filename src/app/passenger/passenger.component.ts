import { Component } from '@angular/core';
import {TourOrganizerService} from "../services/tour-organizer.service";
import {TourOrganizer} from "../services/organizer";

@Component({
  selector: 'app-passenger',
  standalone: true,
  imports: [],
  templateUrl: './passenger.component.html',
  styleUrl: './passenger.component.css'
})
export class PassengerComponent {
  constructor(private tourOrganizer: TourOrganizerService) {
  }

  printBuses() {
    console.log(this.tourOrganizer.getBuses())
  }

}
