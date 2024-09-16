import {Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {BusService} from "./services/bus.service";
import {PassengerComponent} from "./passenger/passenger.component";
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {BusSelectionButtonsComponent} from "./bus-selection-buttons/bus-selection-buttons.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BusAutomationComponent} from "./bus-automation/bus-automation.component";
import {PickupsService} from "./services/pickups.service";
import {OptionsService} from "./services/options.service";
import {SidenavComponent} from "./sidenav/sidenav.component";
import {HorizontalNavComponent} from "./horizontal-nav/horizontal-nav.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PassengerComponent, CommonModule, BusSelectionButtonsComponent, NgOptimizedImage, FormsModule, ReactiveFormsModule, BusAutomationComponent, RouterLink, RouterLinkActive, SidenavComponent, HorizontalNavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  @ViewChild('content') content!: ElementRef;
  isClosed: boolean = true;
  readonly maxWidth: number = 900;
  readonly horizontalNavMaxWidth: number = 600;
  smallScreen !: boolean;
  selectedOption !: string;
  useHorizontalNav !: boolean;

  constructor(private router: Router, private renderer: Renderer2, private pickupService: PickupsService, private busService: BusService, private optionService: OptionsService) {
  }

  ngOnInit() {
    this.smallScreen = window.innerWidth < this.maxWidth;
    this.useHorizontalNav = window.innerWidth < this.horizontalNavMaxWidth;  // Controls horizontal nav
    this.router.events.subscribe(() => {
      this.selectedOption = this.router.url.split('/')[1];
    });
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth < this.maxWidth) {
      this.isClosed = true;
    }
    this.smallScreen = window.innerWidth < this.maxWidth;
    this.useHorizontalNav = window.innerWidth < this.horizontalNavMaxWidth;  // Controls horizontal nav
  }

  toggleMenu(event: any) {
    this.isClosed = event
  }

  getStyles(){
    if(this.useHorizontalNav) return
    else if(this.smallScreen){
      return {
        'position': 'relative',
        'left': '88px',
        'width': 'calc(100% - 88px)',
      }
    }
    else if(!this.smallScreen && !this.isClosed){
      return {
        'position': 'relative',
        'left': '250px',
        'width': 'calc(100% - 250px)',
        'transition': 'all 0.3s ease'
      }
    }

    else{
      return {
        'position': 'relative',
        'left': '88px',
        'width': 'calc(100% - 88px)',
        'transition': 'all 0.3s ease'
      }
    }
  }
}
