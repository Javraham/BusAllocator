import { Component, OnInit } from '@angular/core';
import { NgClass, NgForOf, NgIf } from "@angular/common";
import { BusObjectComponent } from "../bus-object/bus-object.component";
import { IPickup } from "../typings/ipickup";
import { PickupsService } from "../services/pickups.service";
import { OptionObjectComponent } from "../option-object/option-object.component";
import { OptionsService } from "../services/options.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { BusSettingsPageComponent } from "../bus-settings-page/bus-settings-page.component";
import { OptionsSettingsPageComponent } from "../options-settings-page/options-settings-page.component";
import { PickupsSettingsComponent } from "../pickups-settings/pickups-settings.component";
import { ExperienceSettingsPageComponent } from "../experience-settings-page/experience-settings-page.component";
import { EmailTemplatesComponent } from "../email-templates-settings/email-templates.component";
import { DriversSettingsComponent } from "../drivers-settings/drivers-settings.component";
import { ToursSettingsComponent } from "../tours-settings/tours-settings.component";

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
    PickupsSettingsComponent,
    ExperienceSettingsPageComponent,
    EmailTemplatesComponent,
    DriversSettingsComponent,
    ToursSettingsComponent
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.css'
})
export class SettingsPageComponent implements OnInit {
  navOptions = ["Buses", "Bus Drivers", "Pickups", "Options", "Tours", "Experiences", "Email Templates"];
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

  }
  changeSelectedOption(option: string) {
    this.selectOption = option
    this.router.navigate([], { queryParams: { option } });
  }
}
