import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {RouterLink} from "@angular/router";
import {PickupsService} from "../services/pickups.service";
import {BusService} from "../services/bus.service";
import {OptionsService} from "../services/options.service";
import {ExperiencesService} from "../services/experiences.service";
import {EmailTemplatesService} from "../services/email-templates.service";

@Component({
  selector: 'app-horizontal-nav',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './horizontal-nav.component.html',
  styleUrl: './horizontal-nav.component.css'
})
export class HorizontalNavComponent {
  @ViewChild('navbar') navbar!: ElementRef;
  // @ViewChild('content') content!: ElementRef;
  @ViewChild('navList', { static: false }) navList!: ElementRef;
  menuList = document.getElementById("navList") as HTMLElement;

  constructor(private renderer: Renderer2, private templateService: EmailTemplatesService, private pickupService: PickupsService, private busService: BusService, private optionService: OptionsService, private experienceService: ExperiencesService) {
  }

  ngAfterViewInit() {
    const navbarHeight = this.navbar.nativeElement.offsetHeight;
    this.renderer.setStyle(this.navList.nativeElement, 'top', `${navbarHeight}px`);

    this.navList.nativeElement.style.maxHeight = '0px';
  }

  ngOnInit() {
    this.pickupService.setPickupLocations()
    this.busService.setBuses()
    this.optionService.setOptions()
    this.experienceService.setExperiences();
    this.templateService.setEmailTemplates();
  }

  toggleMenu() {
    const currentMaxHeight = this.navList.nativeElement.style.maxHeight;
    if (currentMaxHeight === '0px' || currentMaxHeight === '') {
      this.renderer.setStyle(this.navList.nativeElement, 'maxHeight', '300px');
    } else {
      this.renderer.setStyle(this.navList.nativeElement, 'maxHeight', '0px');
    }
  }

  turnOffMenu() {
    this.renderer.setStyle(this.navList.nativeElement, 'maxHeight', '0px');
  }
}
