import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CorporateIDService {
  private storageKey = 'corporateID';

  get corporateID(): number {
    return parseInt(localStorage.getItem(this.storageKey), 10);
  }

  set corporateID(value: number) {
    localStorage.setItem(this.storageKey, value.toString());
  }

  clearCorporateID() {
    localStorage.removeItem(this.storageKey);
  }
  
  constructor() { }
}
