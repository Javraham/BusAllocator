import {Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
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
  imports: [RouterOutlet, PassengerComponent, CommonModule, BusSelectionButtonsComponent, NgOptimizedImage, FormsModule, ReactiveFormsModule, BusAutomationComponent, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  @ViewChild('content') content!: ElementRef;
  isClosed: boolean = true;

  constructor(private renderer: Renderer2, private pickupService: PickupsService, private busService: BusService, private optionService: OptionsService) {
  }

  ngOnInit() {
    this.pickupService.setPickupLocations()
    this.busService.setBuses()
    this.optionService.setOptions()
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth < 768) {
      this.isClosed = true;
    }
  }

  toggleMenu() {
    this.isClosed = !this.isClosed;
  }
}
