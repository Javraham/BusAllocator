export interface FetchBookingDataOptions {
  endpoint: string;
  httpMethod: string;
  date: string;
  body?: object; // Make body optional
}
