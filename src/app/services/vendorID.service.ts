import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VendorIDService {
  private storageKey = 'vendorID';

  get vendorID(): number {
    return parseInt(localStorage.getItem(this.storageKey), 10);
  }

  set vendorID(value: number) {
    localStorage.setItem(this.storageKey, value.toString());
  }

  clearvendorID() {
    localStorage.removeItem(this.storageKey);
  }
  
  constructor() { }
}
