import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {BusObjectComponent} from "../bus-object/bus-object.component";
import {IBus} from "../typings/BusSelection";
import {BusService} from "../services/bus.service";

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    NgIf,
    BusObjectComponent
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.css'
})
export class SettingsPageComponent implements OnInit{
  navOptions = ["Buses", "Pickups", "Options"];
  selectOption = "Buses"
  buses !: IBus[]

  constructor(private busService: BusService) {
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
  }
  changeSelectedOption(option: string){
    this.selectOption = option
  }
}
