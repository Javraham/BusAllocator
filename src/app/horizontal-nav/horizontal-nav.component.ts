import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";

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

  turnOffMenu() {

  }

  toggleMenu() {

  }
}
