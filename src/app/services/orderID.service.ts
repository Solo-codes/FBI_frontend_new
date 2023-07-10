import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderIDService {
  private storageKey = 'orderID';

  get orderID(): number {
    return parseInt(localStorage.getItem(this.storageKey), 10);
  }

  set orderID(value: number) {
    localStorage.setItem(this.storageKey, value.toString());
  }

  clearOrderID() {
    localStorage.removeItem(this.storageKey);
  }
  
  constructor() { }
}
