import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-corporate-admin-add',
  templateUrl: './add-corporate-admin.component.html',
  styleUrls: ['./add-corporate-admin.component.scss']
})
export class AddCorporateAdminComponent implements OnInit, OnDestroy {
  myForm: FormGroup;
  Level: string[] = [];

  constructor(private service: AuthService, private router: Router, private fb: FormBuilder, private snackbarService: SnackbarService) { }

  ngOnInit() {
    this.initializeForm();
  }

  ngOnDestroy(): void { }

  initializeForm() {
    this.myForm = this.fb.group({
      name: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        ]
      ],
      contact: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      companyLevels: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      address: ['', Validators.required]
    });

    this.myForm.get('companyLevels').valueChanges.subscribe(() => {
      this.updateDynamicInputs();
    });

    this.updateDynamicInputs();
  }

  updateDynamicInputs() {
    const companyLevelsValue = this.myForm.get('companyLevels').value;

    // Clear the existing dynamic inputs
    this.Level = [];

    // Generate new dynamic inputs based on the value of "companyLevels"
    if (companyLevelsValue && !isNaN(companyLevelsValue)) {
      const levels = parseInt(companyLevelsValue, 10);
      for (let i = 0; i < levels; i++) {
        this.Level.push(`Level ${i + 1}`);
        // Add form control for each dynamic input
        this.myForm.addControl(`Level ${i + 1}`, new FormControl('', Validators.required));
      }
    }
  }

  restrictToNumbers(event: any) {
    const input = event.target;
    const regex = /^[0-9]*$/; // Regular expression to match only numbers

    if (!regex.test(input.value)) {
      input.value = input.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
      this.myForm.get('contact').setValue(input.value); // Update the form control value
    }
  }

  restrictToNumbersLevels(event: any) {
    const input = event.target;
    const regex = /^[0-9]*$/; // Regular expression to match only numbers

    if (!regex.test(input.value)) {
      input.value = input.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
      this.myForm.get('companyLevels').setValue(input.value); // Update the form control value
    }
  }

  restrictToNames(event: any) {
    const input = event.target;
    const regex = /^[A-Za-z\s]*$/; // Regular expression to match letters and spaces

    if (!regex.test(input.value)) {
      input.value = input.value.replace(/[^A-Za-z\s]/g, ''); // Remove non-alphabetic characters
      this.myForm.get('name').setValue(input.value); // Update the form control value
    }
  }

  navigateToCorporatesList() {
    this.router.navigateByUrl('/corporates-list');
  }

  createCorporate() {

        try {
          if (this.myForm.valid) {
            const data = {
              ShortName: '',
              FullName: '',
              IndustryClassification: '',
              DateOfCommencementOfBusiness: '',
              PanNo: '',
              RiskCategory: '',
              Constitution: '',
              DateOfIncorporation: '',
              CbsCifId: '',
              corporateAddress: this.myForm.get('address').value,
              corporateEmail: this.myForm.get('email').value,
              corporateContact: this.myForm.get('contact').value,
              corporateUserGroupLevels: parseInt(this.myForm.get('companyLevels').value, 10),
              corporateUserGroupNames: [] // Initialize corporateUserGroupNames as an empty array
            };

            // Retrieve values of dynamic inputs
            for (let i = 0; i < this.Level.length; i++) {
              const dynamicInputValue = this.myForm.get(`Level ${i + 1}`).value;
              data.corporateUserGroupNames.push({ [`additionalProp${i + 1}`]: dynamicInputValue });
            }

            // Remove the length property from corporateUserGroupNames array
            data.corporateUserGroupNames = data.corporateUserGroupNames.filter((value) => value !== undefined);

            console.log('Data with Dynamic Input Values =', data);

            this.service.post(data, '/v1/corporate/create_corporate/').subscribe(
              (response) => {
                // Handle the success response
                console.log('create response:', response);
                if (response.code === '200') {
                  this.router.navigateByUrl('/corporates-list');
                  this.snackbarService.showCustomSnackBarSuccess('Corporate created successfully')
                  // Reset the form
                  this.myForm.reset();
                  console.log('Corporate created successfully!');
                } else if (response.code === '500') {

                  this.snackbarService.showCustomSnackBarError(response.login)

                } else {

                  this.snackbarService.showCustomSnackBarError(response.txt)
                }
              },
              (error) => {
                // Handle the error response
                console.error('corporate creation failed:', error);

                this.snackbarService.showCustomSnackBarError('An error occurred during create corporate')

              }
            );
          } else {

            if (this.myForm.controls.name.invalid) {

              this.snackbarService.showCustomSnackBarError('Invalid name')
            } else if (this.myForm.controls.email.invalid) {
              this.snackbarService.showCustomSnackBarError('Invalid email format')

            } else if (this.myForm.controls.contact.invalid) {
              this.snackbarService.showCustomSnackBarError('Invalid phone number format')

            } else if (this.myForm.controls.companyLevels.invalid) {
              this.snackbarService.showCustomSnackBarError('Invalid company levels')

            } else if (this.myForm.controls.address.invalid) {
              this.snackbarService.showCustomSnackBarError('Invalid address')

            }

          }
        } catch (error) {
          console.error(error);

          this.snackbarService.showCustomSnackBarError(error)

        }
      
  }




}
