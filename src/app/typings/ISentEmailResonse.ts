import {Timestamp} from "rxjs";

export interface ISentMessageResponse {
  location: string,
  sentTo: string[],
  timestamp?: any,
  tourTime: string
}
