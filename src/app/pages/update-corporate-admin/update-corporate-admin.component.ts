import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CorporateIDService } from 'src/app/services/corporateID.service';
import { Subscription } from 'rxjs';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-corporate-admin-update',
  templateUrl: './update-corporate-admin.component.html',
  styleUrls: ['./update-corporate-admin.component.scss']
})
export class UpdateCorporateAdminComponent implements OnInit, OnDestroy {
  myForm: FormGroup;
  Level: string[] = [];
  Levels: string[] = [];

  data: any = {};
  private companyLevelsSubscription: Subscription;

  constructor(
    private service: AuthService,
    private router: Router,
    private corporateIDservice: CorporateIDService,
    private fb: FormBuilder,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit() {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    if (this.companyLevelsSubscription) {
      this.companyLevelsSubscription.unsubscribe();
    }
  }

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

    this.companyLevelsSubscription = this.myForm.get('companyLevels').valueChanges.subscribe(() => {
      this.updateDynamicInputs();
    });

    this.getCoporate();
  }

  updateDynamicInputs() {
    const companyLevelsValue = this.myForm.get('companyLevels').value;

    // Clear the existing dynamic inputs
    this.Level = [];

    // Generate new dynamic inputs based on the value of "companyLevels"
    if (companyLevelsValue && !isNaN(companyLevelsValue)) {
      const levels = parseInt(companyLevelsValue, 10);
      for (let i = 0; i < levels; i++) {
        const levelName = `Level ${i + 1}`;
        this.Level.push(levelName);

        // Check if the level exists in this.Levels list
        if (i < this.Levels.length) {
          const levelValue = this.Levels[i];
          const control = new FormControl(levelValue, Validators.required);
          this.myForm.addControl(levelName, control);
          this.myForm.get(levelName).setValue(levelValue);
        } else {
          this.myForm.addControl(levelName, new FormControl('', Validators.required));
        }

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

  getCoporate() {
    const corporateID = this.corporateIDservice.corporateID;
    this.service
      .getCoporate(corporateID, '/v1/corporate/list_corporate_individual/')
      .subscribe(
        (response) => {
          this.data = response.data[0];
          console.log('details retrieved successfully:', this.data);
          this.myForm.get('name').setValue(this.data.FullName);
          this.myForm.get('email').setValue(this.data.corporateEmail);
          this.myForm.get('contact').setValue(this.data.corporateContact);
          this.myForm.get('address').setValue(this.data.corporateAddress);
          this.myForm.get('companyLevels').setValue(this.data.corporateUserGroupLevels);
          this.Levels = Object.values(this.data.corporateUserGroupNames).map(group => Object.values(group)[0]); // Extract the user group names
          console.log('Levels:', this.Levels);
          this.updateDynamicInputs(); // Call updateDynamicInputs() after setting the form values
        },
        (error) => {
          console.error('Failed to retrieve details:', error);
        }
      );
  }

  updateCorporate() {
    Swal.fire({
      title: 'Update corporate?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          if (this.myForm.valid) {
            const data = {
              corporateID: this.corporateIDservice.corporateID,
              ShortName: '',
              FullName: this.myForm.get('name').value,
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
              corporateUserGroupNames: []
            };

            // Retrieve values of dynamic inputs
            for (let i = 0; i < this.Level.length; i++) {
              const dynamicInputValue = this.myForm.get(`Level ${i + 1}`).value;
              const group = { levelName: `additionalProp${i + 1}`, levelValue: dynamicInputValue };
              data.corporateUserGroupNames.push(group);
            }

            console.log('Data with Dynamic Input Values =', data);

            this.service.put(data, '/v1/corporate/update_corporates/').subscribe(
              (response) => {
                // Handle the success response
                console.log('update response:', response);
                if (response.code === '200') {
                  this.router.navigateByUrl('/corporates-list');
                  // Reset the form
                  this.myForm.reset();
                  console.log('Corporate updated successfully!');
                  this.snackbarService.showCustomSnackBarSuccess('Corporate updated successfully!')

                } else if (response.code === '500') {

                  this.snackbarService.showCustomSnackBarError(response.update_corporates)

                } else {

                  this.snackbarService.showCustomSnackBarError(response.update_corporates)

                }
              },
              (error) => {
                // Handle the error response
                console.error('corporate update failed:', error);

                this.snackbarService.showCustomSnackBarError('An error occurred during update corporate')

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
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Not updated', 'error');
      }
    });
  }


}
