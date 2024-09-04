export interface IPickup {
  docId?: string,
  name: string,
  abbreviation: string,
  emailTemplate: IEmailTemplate
}

export interface IEmailTemplate {
  subject: string,
  body: string
}

// export const pickups: IPickup[] = [
//   {
//     name: "Royal Ontario Museum",
//     abbreviation: "ROM",
//     emailTemplate: {
//       subject: "Niagara Tour Confirmation for",
//       body: "Hi there! We are just confirming your pick-up details for your Niagara tour! \n" +
//         "\n" +
//         "Location: 100 Queens Park, in front of the Royal Ontario Museum’s main entrance on the Queens Park side\n" +
//         "\n" +
//         "Time: 7:45 AM\n" +
//         "\n" +
//         "Map link: https://goo.gl/maps/ZL2A6YhXcVQEVHHj9\n" +
//         "\n" +
//         "Please arrive 10 minutes early because the bus will depart by the posted time. We will be in a white minibus that says “QUEEN” on the front. We have a few buses on the road, so a different QUEEN bus might pass you, but don’t worry, your bus will stop at the right spot. Our office number is +1 416-792-7968 if you need help in the morning. \n" +
//         "\n" +
//         "*if you want to add attractions to your tour make sure you bring CAD or USD cash as only cash is accepted on the bus.*\n" +
//         "\n" +
//         "Enjoy your day :)"
//     }
//   },
//   {
//     name: "Courtyard",
//     abbreviation: "Courtyard",
//     emailTemplate: {
//       subject: "Niagara Tour Confirmation for",
//       body: "Hi there! We are just confirming your pick-up details for your Niagara tour! \n" +
//         "\n" +
//         "Location: 475 Yonge Street, the Courtyard by Marriott hotel. Wait for us outside of the hotel’s rear exit, on Wood Street.\n" +
//         "\n" +
//         "Time: 7:55 AM\n" +
//         "\n" +
//         "Map link: https://goo.gl/maps/g18MpQyxWtwW1ZKL8\n" +
//         "\n" +
//         "Please arrive 10 minutes early because the bus will depart by the posted time. We will be in a white minibus that says “QUEEN” on the front. We have a few buses on the road, so a different QUEEN bus might pass you, but don’t worry, your bus will stop at the right spot. Our office number is +1 416-792-7968 if you need help in the morning. \n" +
//         "\n" +
//         "*if you want to add attractions to your tour make sure you bring CAD or USD cash as only cash is accepted on the bus.*\n" +
//         "\n" +
//         "Enjoy your day :)"
//     }
//   },
//   {
//     name: "Doubletree",
//     abbreviation: "Doubletree",
//     emailTemplate: {
//       subject: "Niagara Tour Confirmation for",
//       body: "Hi there! We are just confirming your pick-up details for your Niagara tour! \n" +
//         "\n" +
//         "Location: 108 Chestnut Street, at the DoubleTree by Hilton Toronto Downtown\n" +
//         "\n" +
//         "Time: 8:00 AM\n" +
//         "\n" +
//         "Map link: https://goo.gl/maps/SXDAW3R2wBfXpRAM7\n" +
//         "\n" +
//         "Please arrive 10 minutes early because the bus will depart by the posted time. We will be in a white minibus that says “QUEEN” on the front. We have a few buses on the road, so a different QUEEN bus might pass you, but don’t worry, your bus will stop at the right spot. Our office number is +1 416-792-7968 if you need help in the morning. \n" +
//         "\n" +
//         "*if you want to add attractions to your tour make sure you bring CAD or USD cash as only cash is accepted on the bus.*\n" +
//         "\n" +
//         "Enjoy your day :)"
//     }
//   },
//   {
//     name: "Chelsea",
//     abbreviation: "Chelsea",
//     emailTemplate: {
//       subject: "Niagara Tour Confirmation for",
//       body: "Hi there! We are just confirming your pick-up details for your Niagara tour! \n" +
//         "\n" +
//         "Location: 33 Gerrard Street West, the Chelsea hotel, in front of the Gerrard St doors. \n" +
//         "IMPORTANT: make sure you are at the Gerrard St doors because there are other doors we will not stop at\n" +
//         "\n" +
//         "Time: 8:00 AM\n" +
//         "\n" +
//         "Map link: https://goo.gl/maps/JLRHqveCNm22zipp7 \n" +
//         "\n" +
//         "Please arrive 10 minutes early because the bus will depart by the posted time. We will be in a white minibus that says “QUEEN” on the front. We have a few buses on the road, so a different QUEEN bus might pass you, but don’t worry, your bus will stop at the right spot. Our office number is +1 416-792-7968 if you need help in the morning. \n" +
//         "\n" +
//         "*if you want to add attractions to your tour make sure you bring CAD or USD cash as only cash is accepted on the bus.*\n" +
//         "\n" +
//         "Enjoy your day :)"
//     }
//   },
//   {
//     name: "Dundas",
//     abbreviation: "Dundas",
//     emailTemplate: {
//       subject: "Niagara Tour Confirmation for",
//       body: "Hi there! We are just confirming your pick-up details for your Niagara tour! \n" +
//         "\n" +
//         "Location: 279 Yonge Street, wait for us across the street from the ‘Shoppers Drug Mart’ store (wait where you will see the Samsung store logo)\n" +
//         "\n" +
//         "Time: 8:10 AM\n" +
//         "\n" +
//         "Map link: https://goo.gl/maps/aY4wuwHE2KSxKYTp7\n" +
//         "\n" +
//         "Please arrive 10 minutes early because the bus will depart by the posted time. We will be in a white minibus that says “QUEEN” on the front. We have a few buses on the road, so a different QUEEN bus might pass you, but don’t worry, your bus will stop at the right spot. Our office number is +1 416-792-7968 if you need help in the morning. \n" +
//         "\n" +
//         "*if you want to add attractions to your tour make sure you bring CAD or USD cash as only cash is accepted on the bus.*\n" +
//         "\n" +
//         "Enjoy your day :)\n"
//     }
//   },
//   {
//     name: "Queen Station",
//     abbreviation: "Queen",
//     emailTemplate: {
//       subject: "Niagara Tour Confirmation for",
//       body: "Hi there! We are just confirming your pick-up details for your Niagara tour! \n" +
//         "\n" +
//         "Location: 140 Yonge Street, in front of the \"Dineen Coffee Co\" cafe  \n" +
//         "\n" +
//         "Time: 8:10 AM\n" +
//         "\n" +
//         "Map link: https://goo.gl/maps/s5kSXdhLzFqHkw9D6\n" +
//         "\n" +
//         "Please arrive 10 minutes early because the bus will depart by the posted time. We will be in a white minibus that says “QUEEN” on the front. We have a few buses on the road, so a different QUEEN bus might pass you, but don’t worry, your bus will stop at the right spot. Our office number is +1 416-792-7968 if you need help in the morning. \n" +
//         "\n" +
//         "*if you want to add attractions to your tour make sure you bring CAD or USD cash as only cash is accepted on the bus.*\n" +
//         "\n" +
//         "Enjoy your day :)\n"
//     }
//   },
//   {
//     name: "Hockey",
//     abbreviation: "Hockey",
//     emailTemplate: {
//       subject: "Niagara Tour Confirmation for",
//       body: "Hi there! We are just confirming your pick up details for your Niagara tour! \n" +
//         "\n" +
//         "Location: 30 Yonge Street, in front of the Hockey Hall of Fame. Please wait for us on the Yonge Street side of the building\n" +
//         "\n" +
//         "Time: 8:10 AM\n" +
//         "\n" +
//         "Map link: https://goo.gl/maps/LFBQKzto88pCKX2M9\n" +
//         "\n" +
//         "Please arrive 10 minutes early because the bus will depart by the posted time. We will be in a white minibus that says “QUEEN” on the front. We have a few buses on the road, so a different QUEEN bus might pass you, but don’t worry, your bus will stop at the right spot. Our office number is +1 416-792-7968 if you need help in the morning. \n" +
//         "\n" +
//         "*if you want to add attractions to your tour make sure you bring CAD or USD cash as only cash is accepted on the bus.*\n" +
//         "\n" +
//         "Enjoy your day :)"
//     }
//   },
//   {
//     name: "Fairmont",
//     abbreviation: "Fairmont",
//     emailTemplate: {
//       subject: "Niagara Tour Confirmation for",
//       body: "Hi there! We are just confirming your pick up details for your Niagara tour! \n" +
//         "\n" +
//         "Location: 100 Front Street West, the Fairmont Royal York hotel, outside of the Front Street doors where the flags are (make sure to be ready early because we aren't allowed to park there)\n" +
//         "\n" +
//         "Time: 8:15 AM\n" +
//         "\n" +
//         "Map link: https://goo.gl/maps/3FZPvSKdtN7KXTp58\n" +
//         "\n" +
//         "Please arrive 10 minutes early because the bus will depart by the posted time. We will be in a white minibus that says “QUEEN” on the front. We have a few buses on the road, so a different QUEEN bus might pass you, but don’t worry, your bus will stop at the right spot. Our office number is +1 416-792-7968 if you need help in the morning. \n" +
//         "\n" +
//         "*if you want to add attractions to your tour make sure you bring CAD or USD cash as only cash is accepted on the bus.*\n" +
//         "\n" +
//         "Enjoy your day :)"
//     }
//   },
//   {
//     name: "Inter",
//     abbreviation: "Intercontinental",
//     emailTemplate: {
//       subject: "Niagara Tour Confirmation for",
//       body: "Hi there! We are just confirming your pick up details for your Niagara tour! \n" +
//         "\n" +
//         "Location: 225 Front Street West, across the street from the Intercontinental hotel’s front doors - you will see a restaurant called \"Scadabush\" that we will stop in front of\n" +
//         "\n" +
//         "Time: 8:15 AM\n" +
//         "\n" +
//         "Map link: https://goo.gl/maps/gsQo5f44sC76XTgi8\n" +
//         "\n" +
//         "Please arrive 10 minutes early because the bus will depart by the posted time. We will be in a white minibus that says “QUEEN” on the front. We have a few buses on the road, so a different QUEEN bus might pass you, but don’t worry, your bus will stop at the right spot. Our office number is +1 416-792-7968 if you need help in the morning. \n" +
//         "\n" +
//         "*if you want to add attractions to your tour make sure you bring CAD or USD cash as only cash is accepted on the bus.*\n" +
//         "\n" +
//         "Enjoy your day :)"
//     }
//   },
//   {
//     name: "300 Front",
//     abbreviation: "300 Front",
//     emailTemplate: {
//       subject: "Niagara Tour Confirmation for",
//       body: "Hi there! We are just confirming your pick up details for your Niagara tour! \n" +
//         "\n" +
//         "Location: 300 Front Street West, in front of the ‘Starbucks’ cafe\n" +
//         "\n" +
//         "Time: 8:20 AM\n" +
//         "\n" +
//         "Map link: https://goo.gl/maps/9H8rs7PAnm7nwtq36\n" +
//         "\n" +
//         "Please arrive 10 minutes early because the bus will depart by the posted time. We will be in a white minibus that says “QUEEN” on the front. We have a few buses on the road, so a different QUEEN bus might pass you, but don’t worry, your bus will stop at the right spot. Our office number is +1 416-792-7968 if you need help in the morning. \n" +
//         "\n" +
//         "*if you want to add attractions to your tour make sure you bring CAD or USD cash as only cash is accepted on the bus.*\n" +
//         "\n" +
//         "Enjoy your day :)"
//     }
//   },
//   {
//     name: "352 Front",
//     abbreviation: "352 Front",
//     emailTemplate: {
//       subject: "Niagara Tour Confirmation for",
//       body: "Hi there! We are just confirming your pick up details for your Niagara tour! \n" +
//         "\n" +
//         "Location: 352 Front Street West, in front of the building entrance\n" +
//         "\n" +
//         "Time: 8:20 AM\n" +
//         "\n" +
//         "Map link: https://goo.gl/maps/En5GCpG8LKAsUt8S6\n" +
//         "\n" +
//         "Please arrive 10 minutes early because the bus will depart by the posted time. We will be in a white minibus that says “QUEEN” on the front. We have a few buses on the road, so a different QUEEN bus might pass you, but don’t worry, your bus will stop at the right spot. Our office number is +1 416-792-7968 if you need help in the morning. \n" +
//         "\n" +
//         "*if you want to add attractions to your tour make sure you bring CAD or USD cash as only cash is accepted on the bus.*\n" +
//         "\n" +
//         "Enjoy your day :)\n" +
//         "\n"
//     }
//   },
//   {
//     name: "MISSISSAUGA",
//     abbreviation: "Mississauga",
//     emailTemplate: {
//       subject: "Niagara Tour Confirmation for",
//       body: "Hi there! We are just confirming your pick up details for your Niagara tour! \n" +
//         "\n" +
//         "Location: 2125 North Sheridan Way, at the Holiday Inn Express in Mississauga\n" +
//         "\n" +
//         "Time: 8:55 AM. *Be ready by 8:45 AM. We are coming from Toronto so in case there is a traffic issue on the way we may be delayed, but that is not a normal occurrence.\n" +
//         "\n" +
//         "Map link: https://goo.gl/maps/gw3J4sGFpPvFc6sC8\n" +
//         "\n" +
//         "Please arrive 10 minutes early because the bus will depart by the posted time. We will be in a white minibus that says “QUEEN” on the front. We have a few buses on the road, so a different QUEEN bus might pass you, but don’t worry, your bus will stop at the right spot. Our office number is +1 416-792-7968 if you need help in the morning. \n" +
//         "\n" +
//         "*if you want to add attractions to your tour make sure you bring CAD or USD cash as only cash is accepted on the bus.*\n" +
//         "\n" +
//         "Enjoy your day :)"
//     }
//   }
// ]
