import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import Swal from 'sweetalert2';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
    selector: 'app-corporate',
    templateUrl: './add-vendor-corporate.component.html',
    styleUrls: ['./add-vendor-corporate.component.scss']
})
export class AddVendorCorporateComponent implements OnInit, OnDestroy {

    myForm: FormGroup;
    Level: string[] = [];

    constructor(private service: AuthService, private router: Router, private fb: FormBuilder, private snackbarService: SnackbarService) { }
    ngOnInit() {
        this.initializeForm();
    }
    ngOnDestroy() {

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

            address: ['', Validators.required]
        });


    }

    restrictToNumbers(event: any) {
        const input = event.target;
        const regex = /^[0-9]*$/; // Regular expression to match only numbers

        if (!regex.test(input.value)) {
            input.value = input.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
            this.myForm.get('contact').setValue(input.value); // Update the form control value
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
    navigateToVendorList() {
        this.router.navigateByUrl('/corporate-vendor');
    }

    createVendor() {
        Swal.fire({
            title: 'Create vendor?',
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
                            vendorName: this.myForm.get('name').value,
                            vendorAddress: this.myForm.get('address').value,
                            vendorEmail: this.myForm.get('email').value,
                            vendorContact: this.myForm.get('contact').value

                        };


                        this.service.post(data, '/v1/vendor/add_vendor/').subscribe(
                            (response) => {
                                // Handle the success response
                                console.log('create response:', response);
                                if (response.code === '200') {
                                    this.router.navigateByUrl('/corporate-vendor');
                                    this.snackbarService.showCustomSnackBarSuccess('Vendor created successfully!')

                                    // Reset the form
                                    this.myForm.reset();
                                    console.log('Vendor created successfully!');
                                } else if (response.code === '500') {

                                    this.snackbarService.showCustomSnackBarError(response.add_vendor)

                                } else {

                                    this.snackbarService.showCustomSnackBarError(response.add_vendor)

                                }
                            },
                            (error) => {
                                // Handle the error response
                                console.error('vendor creation failed:', error);

                                this.snackbarService.showCustomSnackBarError('An error occurred during create vendor')

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
                Swal.fire('Cancelled', 'Not created', 'error');
            }
        });
    }
}