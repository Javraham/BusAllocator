import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
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
  @ViewChild('navList', { static: false }) navList!: ElementRef;
  menuList = document.getElementById("navList") as HTMLElement;

  constructor(private renderer: Renderer2, private pickupService: PickupsService, private busService: BusService, private optionService: OptionsService) {
  }

  ngAfterViewInit() {
    const navbarHeight = this.navbar.nativeElement.offsetHeight;
    const mediaQuery = window.matchMedia('(max-width: 600px)');
    this.content.nativeElement.style.marginTop = `${navbarHeight}px`;

    if (mediaQuery.matches) {
      // If the media query matches, apply the top value dynamically to the ul
      this.renderer.setStyle(this.navList.nativeElement, 'top', `${navbarHeight}px`);
    }

    // Listen for changes in screen width (for responsiveness)
    mediaQuery.addEventListener('change', (event) => {
      if (event.matches) {
        // If the screen width goes below 600px, set the top value
        this.renderer.setStyle(this.navList.nativeElement, 'top', `${navbarHeight}px`);
      } else {
        // If the screen width goes above 600px, remove the top value
        this.renderer.removeStyle(this.navList.nativeElement, 'top');
      }
    });

    this.navList.nativeElement.style.maxHeight = '0px';
  }

  ngOnInit() {
    this.pickupService.setPickupLocations()
    this.busService.setBuses()
    this.optionService.setOptions()
  }

  toggleMenu() {
    const currentMaxHeight = this.navList.nativeElement.style.maxHeight;
    if (currentMaxHeight === '0px' || currentMaxHeight === '') {
      this.renderer.setStyle(this.navList.nativeElement, 'maxHeight', '300px');
    } else {
      this.renderer.setStyle(this.navList.nativeElement, 'maxHeight', '0px');
    }
  }
}
