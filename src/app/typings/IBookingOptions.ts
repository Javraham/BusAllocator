export interface IBookingOptions {
  docId?: string,
  option: string,
  abbrev: string
}

export const options: IBookingOptions[] = [
  // 8:00 Tour
  {
    option: "boat cruise and journey",
    abbrev: "Boat Cruise + Journey"
  },
  {
    option: "or journey behind the falls",
    abbrev: "Boat Cruise"
  },
  {
    option: "Standard Tour",
    abbrev: "No boat"
  },

  {
    option: "Standard rate",
    abbrev: "Standard rate"
  },

  // Niagara Falls evening tour (12:20)

  {
    option: "no dinner or illumination tower",
    abbrev: "Tour without dinner and illumination tower"
  },

  {
    option: "all inclusive tour",
    abbrev: "Tour with dinner and illumination tower"
  },

  /*{
      option: "newOption",
      abbrev: "what you want to output to show"
    }
   */

]

