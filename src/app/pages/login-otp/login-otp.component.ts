import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { EmailService } from 'src/app/services/email.service';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { SnackbarService } from 'src/app/services/snackbar.service';


@Component({
  selector: 'app-login-otp',
  templateUrl: './login-otp.component.html',
  styleUrls: ['./login-otp.component.scss']
})

export class LoginOtpComponent implements OnInit, OnDestroy {
  myForm: FormGroup;
  email: string;
  otp: string;
  timer: number;
  timerSubscription: Subscription;
  isLoading: boolean = false;

  restrictToNumbers(event: any) {
    const input = event.target;
    const regex = /^[0-9]*$/; // Regular expression to match only numbers

    if (!regex.test(input.value)) {
      input.value = input.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
      this.myForm.get('otp').setValue(input.value); // Update the form control value
    }
  }

  constructor(private fb: FormBuilder,
    private emailService: EmailService,
    private router: Router,
    private service: AuthService,
    private snackbarService: SnackbarService

  ) { }


  ngOnInit() {



    this.myForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
    });
    this.email = this.emailService.email;
    if (!this.email) {
      // Email is not available, redirect to the login page
      this.router.navigate(['/login']);
    } else {
      console.log(`Email obtained: ${this.email}`);
    }
    this.startTimer();


  }
  ngOnDestroy() {
    this.stopTimer();

  }

  startTimer() {
    this.timer = 180; // 3 minutes in seconds
    
    // Create an interval that updates the timer every second
    this.timerSubscription = interval(1000)
      .pipe(take(this.timer))
      .subscribe(() => {
        this.timer--;
      });
  }

  stopTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
  resendOtp() {
    this.isLoading = true;
    // Add your logic to resend the OTP here
    console.log('Resend OTP');
    const data = { email: this.email };
    this.service.post(data, "/v1/security/login").subscribe(
      (response) => {
        this.isLoading = false;

        // Handle the success response
        console.log('mail send successful:', response);
        // Clear the form
        this.myForm.reset();
        if (response.code === "200") {
          this.emailService.email = data.email;
          this.snackbarService.showCustomSnackBarSuccess(response.txt)
          this.startTimer();
        

        } else {
          this.snackbarService.showCustomSnackBarError('Something went wrong!')

        }
      },
      (error) => {
        this.isLoading = false;

        // Handle the error response
        console.error('Login failed:', error);
        // Display error message
        Swal.fire(error);
        this.snackbarService.showCustomSnackBarError(error)

      }
    );
  }



  verifyOtp() {

    this.isLoading = true;


    const data = {
      email: this.email,
      otp: this.myForm.value.otp.toString(),
    };
    console.log("Data = ", data);
    this.service.post(data, "/v1/security/otp_verify/").subscribe((response) => {
      // Handle the success response
      this.isLoading = false;

      console.log('login successful:', response);
      // Clear the form
      this.myForm.reset();
      if (response.code === "200") {
        this.emailService.email = data.email;
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data));

        this.router.navigate(['/dashboard']);
      }
      else if (response.code === "500") {

        this.snackbarService.showCustomSnackBarError(response.login)
      }
      else {

        this.snackbarService.showCustomSnackBarError(response.txt)

      }
    },
      (error) => {
        this.isLoading = false;

        // Handle the error response
        console.error('Login failed:', error);
        // Display error message

        this.snackbarService.showCustomSnackBarError('An error occurred during login')

      }
    );
  }

  handleOtpInput(value: string) {
    this.otp = value;
    // You can perform additional validation or logic here if needed
  }

  login() {
    // Retrieve the OTP value from this.otp and perform your login logic

    if (this.myForm.valid) {
      const data = this.myForm.value;
      console.log("Data = ", data);
    }
  }
}


