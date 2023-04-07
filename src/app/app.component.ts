import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  name = 'Angular';
  private seats: number[][];
  private numRows: number = 11;
  private numCols: number = 7;
  private lastRowSeats: number[] = [0, 0, 0];
  private msg: string = '';
  private title: string = '';
  constructor() {
    // fill array with 0
    this.seats = new Array(this.numRows)
      .fill(0)
      .map(() => new Array(this.numCols).fill(0));
    this.lastRowSeats.fill(0);

    // already booked seats
    this.reserveSeats(5);
    this.reserveSeats(7);
    this.reserveSeats(4);
    this.msg="";
    
  }

  public reserveSeats(numSeats: number): boolean {
    if (numSeats <= 0 || numSeats > 7) {
      this.title = 'Failed';
      this.msg = 'Invalid number of seats.';
      return false;
    }

    // find seats are available  not
    if (this.findAvailableSeats(numSeats)) {
      this.title = 'Success';
      this.msg = 'Seats reserved successfully ';
      return true;
    } else {
      this.title = 'Failed';
      this.msg = 'Sorry, no available seats';
      return false;
    }
  }

  private findAvailableSeats(numSeats: number): boolean {
    let numAvailableSeats = 0; // the number of available seats found so far

    // First try to find available seats in one row
    for (let i = 0; i < this.numRows; i++) {
      numAvailableSeats = 0;
      for (let j = 0; j < this.numCols; j++) {
        if (this.seats[i][j] === 0) {
          numAvailableSeats++;
          if (numAvailableSeats == numSeats) {
            //Book Seats
            let pos = j - numSeats + 1;
            for (let k = 1; k <= numSeats; k++) {
              this.seats[i][pos] = 1;
              pos++;
            }
            return true;
          }
        } else {
          numAvailableSeats = 0;
        }
      }
    }

    // If seats are not available in one row then try to find non-consecutive seats
    numAvailableSeats = 0;
    let availableSeats: number[][] = [];
    for (let i = 0; i < this.numRows; i++) {
      for (let j = 0; j < this.seats[i].length; j++) {
        if (this.seats[i][j] === 0) {
          availableSeats.push([i, j]);
          numAvailableSeats++;
          if (numAvailableSeats == numSeats) {
            //Book Seats
            for (let row of availableSeats) {
              this.seats[row[0]][row[1]] = 1;
            }
            return true;
          }
        }
      }
    }

    // book seats in last row if required
    if (availableSeats.length + 3 >= numSeats) {
      for (let row of availableSeats) {
        this.seats[row[0]][row[1]] = 1;
        numSeats--;
        if (numSeats == 0) return true;
      }
      for (let i = 0; i < numSeats; i++) {
        this.lastRowSeats[i] = 1;
      }
      return true;
    }

    // If no seats are available, return false
    return false;
  }

  // reset popup msg
  private resetMSG(): void {
    this.msg = '';
    this.title = '';
  }
}
