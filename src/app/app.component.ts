import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {BusService} from "./services/bus.service";
import {PassengerComponent} from "./passenger/passenger.component";
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {BusSelectionButtonsComponent} from "./bus-selection-buttons/bus-selection-buttons.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BusAutomationComponent} from "./bus-automation/bus-automation.component";
import {PickupsService} from "./services/pickups.service";
import {OptionsService} from "./services/options.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PassengerComponent, CommonModule, BusSelectionButtonsComponent, NgOptimizedImage, FormsModule, ReactiveFormsModule, BusAutomationComponent, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  @ViewChild('navbar') navbar!: ElementRef;
  @ViewChild('content') content!: ElementRef;

  constructor(private pickupService: PickupsService, private busService: BusService, private optionService: OptionsService) {
  }

  ngAfterViewInit() {
    const navbarHeight = this.navbar.nativeElement.offsetHeight;
    this.content.nativeElement.style.marginTop = `${navbarHeight}px`;
  }

  ngOnInit() {
    this.pickupService.setPickupLocations()
    this.busService.setBuses()
    this.optionService.setOptions()
  }
}
