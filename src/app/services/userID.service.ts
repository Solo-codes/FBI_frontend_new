import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserIDService {
  private storageKey = 'userID';

  get userID(): number {
    return parseInt(localStorage.getItem(this.storageKey), 10);
  }

  set userID(value: number) {
    localStorage.setItem(this.storageKey, value.toString());
  }

  clearUserID() {
    localStorage.removeItem(this.storageKey);
  }
  
  constructor() { }
}
