import {Component, HostListener} from '@angular/core';
import {buses} from "../typings/BusSelection";
import {NgForOf} from "@angular/common";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [NgForOf, CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css'
})
export class DropdownComponent {

  protected readonly buses = buses;
  selectedOptions: string[] = [];
  isDropdownOpen: boolean = false;

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const dropdownElement = document.querySelector('.dropdown') as HTMLElement;

    if (dropdownElement && !dropdownElement.contains(target)) {
      this.isDropdownOpen = false;
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onCheckboxChange(optionValue: string, event: any) {
    if (event.target.checked) {
      this.selectedOptions.push(optionValue);
    } else {
      const index = this.selectedOptions.indexOf(optionValue);
      if (index > -1) {
        this.selectedOptions.splice(index, 1);
      }
    }
  }

  getButtonText(): string {
    if (this.selectedOptions.length === 0) {
      return 'Select Options';
    }
    else{
      return '2'
    }
  }
}
