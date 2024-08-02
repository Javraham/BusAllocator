import { Component } from '@angular/core';
import {Passenger} from "../typings/passenger";
import {ApiService} from "../services/api.service";
import {FetchBookingDataOptions} from "../typings/fetch-data-booking-options";

@Component({
  selector: 'app-side-panel',
  standalone: true,
  imports: [],
  templateUrl: './side-panel.component.html',
  styleUrl: './side-panel.component.css'
})
export class SidePanelComponent {
  title = "Bus Allocation"
  passengers: Passenger[] = [];
  fetchOptions: FetchBookingDataOptions;

  constructor(private apiService: ApiService) {
    this.fetchOptions = this.fetchOptions = {
      endpoint: '/booking.json/booking-search',  // Replace with your actual endpoint
      accessKey: 'bbcf21ba55a94a11b99c10c65406f4f6',
      secretKey: '765b889ad3344f5886a717cd8b490152',
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      httpMethod: "POST",
    };
  }

  async onDateChange(event: any){
    console.log(event.target.value)
    this.passengers = await this.apiService.getPassengers(event.target.value, this.fetchOptions)
    console.log(this.passengers)
  }

  async getTodaysPassengers() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
    const day = String(today.getDate()).padStart(2, '0');

    this.passengers = await this.apiService.getPassengers(`${year}-${month}-${day}`, this.fetchOptions)
    console.log(this.passengers)
  }

  async getTomorrowsPassengers() {
    const today = new Date();
    const tomorrow = new Date(today);

    tomorrow.setDate(today.getDate() + 1);

    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
    const day = String(tomorrow.getDate()).padStart(2, '0');

    this.passengers = await this.apiService.getPassengers(`${year}-${month}-${day}`, this.fetchOptions)
    console.log(this.passengers)
  }
}
