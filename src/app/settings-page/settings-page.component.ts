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
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {BusSettingsPageComponent} from "../bus-settings-page/bus-settings-page.component";
import {OptionsSettingsPageComponent} from "../options-settings-page/options-settings-page.component";

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    NgIf,
    BusObjectComponent,
    OptionObjectComponent,
    ReactiveFormsModule,
    BusSettingsPageComponent,
    OptionsSettingsPageComponent,
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.css'
})
export class SettingsPageComponent implements OnInit{
  navOptions = ["Buses", "Pickups", "Options"];
  selectOption = "Buses"
  pickupLocations !: IPickup[];

  constructor(private pickupsService: PickupsService, private optionsService: OptionsService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const option = params['option'];
      if (option && this.navOptions.includes(option)) {
        this.selectOption = option;
      }
    });

    this.pickupsService.getPickupLocations().subscribe({
      next: (response) => {
        this.pickupLocations = response.data
        console.log(response.data)
      },
      error: err => console.log(err)
    })


  }
  changeSelectedOption(option: string){
    this.selectOption = option
    this.router.navigate([], { queryParams: { option } });
  }
}
