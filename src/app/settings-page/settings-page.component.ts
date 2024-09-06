import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {BusObjectComponent} from "../bus-object/bus-object.component";
import {IBus} from "../typings/BusSelection";
import {BusService} from "../services/bus.service";
import {IPickup} from "../typings/ipickup";
import {PickupsService} from "../services/pickups.service";
import {OptionObjectComponent} from "../option-object/option-object.component";
import {OptionsService} from "../services/options.service";
import {IBookingOptions} from "../typings/IBookingOptions";
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    NgIf,
    BusObjectComponent,
    OptionObjectComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.css'
})
export class SettingsPageComponent implements OnInit{
  navOptions = ["Buses", "Pickups", "Options"];
  selectOption = "Buses"
  buses !: IBus[];
  pickupLocations !: IPickup[];
  options !: IBookingOptions[];
  isBusFormOpen: boolean = false;
  busForm: FormGroup = new FormGroup<any>({
    busId: new FormControl('', [Validators.required]),
    capacity: new FormControl('', [Validators.required]),
    color: new FormControl('')
  })
  errorMsg = '';
  isEditingBus = false;
  busDocId: string | undefined = "";

  constructor(private busService: BusService, private pickupsService: PickupsService, private optionsService: OptionsService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const option = params['option'];
      if (option && this.navOptions.includes(option)) {
        this.selectOption = option;
      }
    });

    this.busService.getBuses().subscribe({
      next: (response) => {
        this.buses = response.data.sort((a: any, b: any) => {
          return parseInt(a.busId.substring(1)) - parseInt(b.busId.substring(1));
        });
        console.log(this.buses);
      },
      error: err => console.log(err)
    });

    this.pickupsService.getPickupLocations().subscribe({
      next: (response) => {
        this.pickupLocations = response.data
        console.log(response.data)
      },
      error: err => console.log(err)
    })

    this.optionsService.getOptions().subscribe({
      next: (response) => {
        this.options = response.data
        console.log(response.data)
      },
      error: err => console.log(err)
    })
  }
  changeSelectedOption(option: string){
    this.selectOption = option
    this.router.navigate([], { queryParams: { option } });
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
