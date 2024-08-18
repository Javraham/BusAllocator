import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {NgIf, NgStyle} from "@angular/common";

@Component({
  selector: 'app-expandable-section',
  standalone: true,
  imports: [
    NgIf,
    NgStyle
  ],
  templateUrl: './expandable-section.component.html',
  styleUrl: './expandable-section.component.css'
})
export class ExpandableSectionComponent{
  @Input() title!: string;
  isExpanded: boolean = false
  @Input() numOfPassengers !: number;

  constructor(private cdr: ChangeDetectorRef) {
  }

  toggle() {
    this.isExpanded = !this.isExpanded
  }
}
