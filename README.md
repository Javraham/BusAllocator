# BusAllocatorAngular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.1.2.

## Change Booking Options

To change the booking options, navigate to the `src/typings` folder. There you will see a file called `IBookingOptions.ts`. To add a new option, scroll down to the bottom of this file and you will see commented out code. As you can see, each set of brackets has two fields, `option ` and `abbrev`. In the option field, write the name of the option that comes from Bokun, and in the abbrev field, write the abbreviation or what you want to be displayed in the output. Use the previous ones I wrote as a guide.

## Add, Remove, or Change Buses

Navigate to `src/typings` folder and select the `BusSelection.ts` file. You will see a variable called `export const buses`. This variable stores all the buses with fields including the bus name, the capacity, and the color (which is just the color thats used when we sort the passengers). To add a bus, simply add a new set of brackets and put in those three fields. You can just copy and paste one set of curly brackets, and just put the values of the fields. You can also change the capacity of buses by changing the number shown in each bus. Likewise for deleting a bus. 

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
