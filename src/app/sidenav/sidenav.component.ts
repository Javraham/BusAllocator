import {Component, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2, ViewChild} from '@angular/core';
import {NgClass, NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {PickupsService} from "../services/pickups.service";
import {BusService} from "../services/bus.service";
import {OptionsService} from "../services/options.service";

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    NgClass
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {
  @Input() isClosed !: boolean;
  selectedOption !: string;
  @Output() changeIsClosed = new EventEmitter<boolean>();

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.router.events.subscribe(() => {
      this.selectedOption = this.router.url.split('/')[1];
    });
  }

  toggleMenu() {
    this.changeIsClosed.emit(!this.isClosed)
  }

  isActive(route: string){
    return this.selectedOption.includes(route)
  }

  isBusActive(){
    return !this.selectedOption.includes('email-automation') && !this.selectedOption.includes('settings')
  }
}
