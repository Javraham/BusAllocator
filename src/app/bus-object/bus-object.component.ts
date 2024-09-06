import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IBus} from "../typings/BusSelection";
import {BusService} from "../services/bus.service";
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-bus-object',
  standalone: true,
  imports: [
    NgStyle
  ],
  templateUrl: './bus-object.component.html',
  styleUrl: './bus-object.component.css'
})
export class BusObjectComponent{
  @Input() busObject !: IBus;
  @Output() editBus = new EventEmitter<IBus>();

  sendBusObjectToParent() {
    this.editBus.emit(this.busObject)
  }
}
