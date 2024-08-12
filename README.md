# BusAllocatorAngular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.1.2.

## Change Booking Options

To change the booking options, navigate to the `src/typings` folder. There you will see a file called `IBookingOptions.ts`. To add a new option, scroll down to the bottom of this file and you will see commented out code. As you can see, each set of brackets has two fields, `option ` and `abbrev`. In the option field, write the name of the option that comes from Bokun, and in the abbrev field, write the abbreviation or what you want to be displayed in the output. Use the previous ones I wrote as a guide.

## Add, Remove, or Change Buses

Navigate to `src/typings` folder and select the `BusSelection.ts` file. You will see a variable called `export const buses`. This variable stores all the buses with fields including the bus name, the capacity, and the color (which is just the color thats used when we sort the passengers). To add a bus, simply add a new set of brackets and put in those three fields. You can just copy and paste one set of curly brackets, and just put the values of the fields. You can also change the capacity of buses by changing the number shown in each bus. Likewise for deleting a bus. 

## Usuage of the App

1. When you first use the app, you must put in the correct access and secret keys, then click the authorize button. If it was the correct credentials, the passenger list will load automatically to todays date. This app uses local storage meaning that you do not need to authorize every time you use the app, only once.
   <strong>Note:</strong> It is recommended to log out every once in a while and authorize again for security purposes
3. To change the date, simply click on the date icon or date field and change the date using the date picker, or click on the `Previous day` or `Next day` to toggle between the different days. Once the date is changed, the passenger list should automatically load the set of passengers for that specific day.
4. Once the list is loaded, you will see different sections for each tour time. Under each time, you will see the bus selection checkboxes where you check the buses you want to use for that tour, a few buttons for reseting and selecting all buses, as well as the list of passengers.
5. To sort the passengers, click on the buses you want to use and click the `sort passengers` button. This will randomly generate the allocation of the passengers into the different selected buses, meaning that every time you click `sort passengers` it will generate a new/random sort.
6. If the sort was successfull, a successfull message will be displayed. If there is no way to sort the passengers, there will be an error message saying to add more buses or remove passengers.
7. To remove a passenger from the output list, click on the `Exclude` button in the passenger component. Then click the `Sort passengers` button again to sort them without the excluded passengers.
8. Note: this process is done for every tour time, meaning that if for example there is a 7:55 tour and 8:00 tour, you select the buses for both those times. If a bus is selected for one time at a specific day, that same bus cannot be selected for a different tour time on that same day (meaning the check box will be disabled).
9. <strong>The Generate List Button: </strong> When this button is clicked, it will produce the output in text format. Once it is generated, feel free to edit the text inside the text box or copy it to be pasted into Bokun.
10. The way the `Generate List` button works is it takes whatever is being shown to the user (whether sorted or not) and will output exactly that in the text box. Meaning that if the passengers are sorted, it will generate an output with the sorted passengers, if it is not sorted then it will not. Think of it as taking a screenshot of whatever is shown to you above the generate list button, and will produce the output below.

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
