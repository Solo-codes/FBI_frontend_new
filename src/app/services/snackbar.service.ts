import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  showCustomSnackBarError(message: string) {
    const config = new MatSnackBarConfig();
    config.duration = 5000;
    config.panelClass = ['custom-snackbar-error'];
  
    // Show the snack bar and return the reference
    return this.snackBar.open(message, 'Close', config);
  }

  showCustomSnackBarSuccess(message: string) {
    const config = new MatSnackBarConfig();
    config.duration = 4000;
    config.panelClass = ['custom-snackbar-success'];
  
    // Show the snack bar and return the reference
    return this.snackBar.open(message, 'Close', config);
  }
  
}
