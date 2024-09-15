import {Component, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2, ViewChild} from '@angular/core';
import {NgClass, NgIf} from "@angular/common";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {PickupsService} from "../services/pickups.service";
import {BusService} from "../services/bus.service";
import {OptionsService} from "../services/options.service";

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    NgClass,
    RouterLinkActive
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {
  @Input() isClosed !: boolean;
  @Output() changeIsClosed = new EventEmitter<boolean>();

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  toggleMenu() {
    this.changeIsClosed.emit(!this.isClosed)
  }

  isBusActive(){

  }
}
