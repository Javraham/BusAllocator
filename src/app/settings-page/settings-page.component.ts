import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {BusObjectComponent} from "../bus-object/bus-object.component";
import {IBus} from "../typings/BusSelection";
import {BusService} from "../services/bus.service";
import {IPickup} from "../typings/ipickup";
import {PickupsService} from "../services/pickups.service";
import {OptionObjectComponent} from "../option-object/option-object.component";
import {OptionsService} from "../services/options.service";
import {IBookingOptions} from "../typings/IBookingOptions";

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    NgIf,
    BusObjectComponent,
    OptionObjectComponent
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.css'
})
export class SettingsPageComponent implements OnInit{
  navOptions = ["Buses", "Pickups", "Options"];
  selectOption = "Buses"
  buses !: IBus[];
  pickupLocations !: IPickup[];
  options !: IBookingOptions[]

  constructor(private busService: BusService, private pickupsService: PickupsService, private optionsService: OptionsService) {
  }

  ngOnInit() {
    this.busService.getBuses().subscribe({
      next: (response) => {
        this.buses = response.data.sort((a: any, b: any) => {
          return parseInt(a.busId.substring(1)) - parseInt(b.busId.substring(1));
        });
        console.log(this.buses);
      },
      error: err => console.log(err)
    });

    this.pickupsService.getPickupLocations().subscribe({
      next: (response) => {
        this.pickupLocations = response.data
        console.log(response.data)
      },
      error: err => console.log(err)
    })

    this.optionsService.getOptions().subscribe({
      next: (response) => {
        this.options = response.data
        console.log(response.data)
      },
      error: err => console.log(err)
    })
  }
  changeSelectedOption(option: string){
    this.selectOption = option
  }
}
