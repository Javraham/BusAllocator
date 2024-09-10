import { Routes } from '@angular/router';
import {BusAutomationComponent} from "./bus-automation/bus-automation.component";
import {EmailAutomationComponent} from "./email-automation/email-automation.component";
import {SettingsPageComponent} from "./settings-page/settings-page.component";

export const routes: Routes = [
  {
    path: "",
    component: BusAutomationComponent,
    title: "Bus Automation Page"
  },
  {
    path: "email-automation",
    component: EmailAutomationComponent,
    title: "Email Automation Page"
  },
  {
    path: "settings",
    component: SettingsPageComponent,
    title: "Settings"
  }
];
