import { Component } from '@angular/core';
import {BusObjectComponent} from "../bus-object/bus-object.component";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {BusService} from "../services/bus.service";
import {IBus} from "../typings/BusSelection";

@Component({
  selector: 'app-bus-settings-page',
  standalone: true,
  imports: [
    BusObjectComponent,
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './bus-settings-page.component.html',
  styleUrl: './bus-settings-page.component.css'
})
export class BusSettingsPageComponent {
  busForm: FormGroup = new FormGroup<any>({
    busId: new FormControl('', [Validators.required]),
    capacity: new FormControl('', [Validators.required]),
    color: new FormControl('')
  })
  errorMsg = '';
  isEditingBus = false;
  busDocId: string | undefined = "";
  buses !: IBus[];
  isBusFormOpen: boolean = false;

  constructor(private busService: BusService) {
  }

  openNewBusForm(){
    this.errorMsg = "";
    this.isBusFormOpen = true
    this.isEditingBus = false
    this.busForm.reset()
  }

  insertSorted(list: IBus[], item: IBus): IBus[] {
    let low = 0;
    let high = list.length;
    const itemNumber = parseInt(item.busId.substring(1), 10); // Extract the number part from the item

    // Binary search to find the correct insertion point
    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      const midNumber = parseInt(list[mid].busId.substring(1), 10); // Extract the number part from the list item
      if (midNumber < itemNumber) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }

    list.splice(low, 0, item);
    return list;
  }

  ngOnInit(){
    this.busService.getBuses().subscribe({
      next: (response) => {
        this.buses = response.data.sort((a: any, b: any) => {
          return parseInt(a.busId.substring(1)) - parseInt(b.busId.substring(1));
        });
        console.log(this.buses);
      },
      error: err => console.log(err)
    });
  }

  addBus(event: any) {
    if(this.busForm.valid){
      this.errorMsg = "";
      this.busService.addBus({color: this.busForm.value.color, busId: this.busForm.value.busId, capacity: this.busForm.value.capacity}).subscribe({
        next: response => {
          this.buses = this.insertSorted(this.buses, response.data)
          this.isBusFormOpen = false
        },
        error: err => this.errorMsg = err.message
      })
      this.busForm.reset()
    }
    else{
      this.errorMsg = "! Please fill in the Bus ID and Capacity fields"
      console.log('not valid')
    }
  }

  updateBus() {
    if(this.busForm.valid){
      this.errorMsg = "";
      this.busService.updateBus({docId: this.busDocId, color: this.busForm.value.color, busId: this.busForm.value.busId, capacity: this.busForm.value.capacity}).subscribe({
        next: response => {
          const busFound = this.buses.find(bus => response.data.docId === bus.docId)
          if(busFound){
            busFound.busId = response.data.busId;
            busFound.capacity = response.data.capacity;
            if(response.data.color){
              busFound.color = response.data.color
            }
          }
          this.isBusFormOpen = false
          this.buses.sort((a: any, b: any) => {
            return parseInt(a.busId.substring(1)) - parseInt(b.busId.substring(1));
          });
          console.log(response.data)
        },
        error: err => this.errorMsg = err.message
      })
      this.busForm.reset()
    }
    else{
      this.errorMsg = "! Please fill in the Bus ID and Capacity fields"
      console.log('not valid')
    }
  }

  cancelBus() {
    this.busForm.reset()
    this.isBusFormOpen = false
  }

  editBus(busObject: IBus) {
    this.errorMsg = "";
    this.busDocId = busObject.docId
    this.isBusFormOpen = true;
    this.isEditingBus = true;

    this.busForm.patchValue({
      busId: busObject.busId,
      capacity: busObject.capacity,
      color: busObject.color
    });
  }

  deleteBus() {
    this.busService.deleteBus(this.busDocId || "").subscribe({
      next: response => {
        const index = this.buses.findIndex(bus => bus.docId === response.docId);
        if(index !== -1){
          this.buses.splice(index, 1)
        }
        this.isBusFormOpen = false
      },
      error: err => this.errorMsg = err.message
    })
  }

}
