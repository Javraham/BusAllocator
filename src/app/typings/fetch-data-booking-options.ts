export interface FetchBookingDataOptions {
  endpoint: string;
  accessKey: string;
  secretKey: string;
  httpMethod: string;
  date: string;
  body?: object; // Make body optional
}
