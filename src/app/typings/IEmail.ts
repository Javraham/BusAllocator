export interface IEmail {
  passengerEmailAddresses: string[],
  subject: string,
  body: string,
  bodyHTML ?: HTMLElement
}
