import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { EmailService } from 'src/app/services/email.service';
import Swal from 'sweetalert2';
import { SnackbarService } from 'src/app/services/snackbar.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  myForm: FormGroup;
  isLoading: boolean = false;


  constructor(
    private fb: FormBuilder,
    private service: AuthService,
    private router: Router,
    private emailService: EmailService,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
    });
  }

  ngOnDestroy() {
  }

  login() {
    this.isLoading = true;
    console.log(`=-=-=-=-loadingssss=-${this.isLoading}`)
    if (this.myForm.valid) {
      const data = this.myForm.value;
      console.log("Data = ", data);

      this.service.post(data, "/v1/security/login").subscribe(
        (response) => {
          // Handle the success response
          this.isLoading = false;
          console.log('mail send successful:', response);
          // Clear the form
          this.myForm.reset();
          if (response.code === "200") {
            this.emailService.email = data.email;
            this.snackbarService.showCustomSnackBarSuccess(response.txt);
            this.router.navigate(['/login-otp']);



          } else {


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
      // const email = this.myForm.controls.email.value;
      this.myForm.reset();
    } else {

      if (this.myForm.controls.email.errors?.required) {
        this.snackbarService.showCustomSnackBarError('Email is required')

      } else if (this.myForm.controls.email.errors?.pattern) {
        this.snackbarService.showCustomSnackBarError('Invalid email format')

      }

    }
  }

}
