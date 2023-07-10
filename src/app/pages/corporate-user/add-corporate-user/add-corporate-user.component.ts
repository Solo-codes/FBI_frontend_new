import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import Swal from 'sweetalert2';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
    selector: 'app-add-user-corporate',
    templateUrl: './add-corporate-user.component.html',
    styleUrls: ['./add-corporate-user.component.scss']
})
export class AddUserCorporateComponent implements OnInit, OnDestroy {
    myForm: FormGroup;
    Level: string[] = [];
    data: any[] = [];

    constructor(private service: AuthService, private router: Router, private fb: FormBuilder, private snackbarService: SnackbarService) { }

    ngOnInit() {
        this.initializeForm();
        this.getCoporateUserGroups()
    }
    ngOnDestroy() {

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

    navigateToUsers() {
        this.router.navigateByUrl('/coroporate-user');
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

            group: ['', Validators.required]
        });


    }

    getCoporateUserGroups() {
        const user = JSON.parse(localStorage.getItem('user'))
        const corporateID = user.user_id;
        console.log(`=-=--=-user_id=-=-${corporateID}`)
        this.service.getCoporateUserGroups(corporateID, '/v1/corporate/list_corporate_user_group/')
            .subscribe(
                (response) => {

                    this.data = response.data;
                    console.log(' group details retrieved successfully:', this.data);

                },
                (error) => {
                    console.error('Failed to get group details:', error);
                }
            );
    }
    createUser() {

        Swal.fire({
            title: 'Create User?',
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
                            corporateUserGroupID: this.myForm.get('group').value,
                            userName: this.myForm.get('name').value,
                            userContact: this.myForm.get('contact').value,
                            userEmail: this.myForm.get('email').value

                        };


                        this.service.post(data, '/v1/users/create_user/').subscribe(
                            (response) => {
                                // Handle the success response
                                console.log('create response:', response);
                                if (response.code === '200') {
                                    this.router.navigateByUrl('/coroporate-user');
                                    this.snackbarService.showCustomSnackBarSuccess('User created successfully!')

                                    // Reset the form
                                    this.myForm.reset();
                                    console.log('User created successfully!');
                                } else if (response.code === '500') {

                                    this.snackbarService.showCustomSnackBarError(response.create_user)

                                } else {

                                    this.snackbarService.showCustomSnackBarError(response.create_user)

                                }
                            },
                            (error) => {
                                // Handle the error response
                                console.error('user creation failed:', error);

                                this.snackbarService.showCustomSnackBarError('An error occurred during create user')

                            }
                        );
                    } else {
                        if (this.myForm.controls.name.invalid) {
                            this.snackbarService.showCustomSnackBarError('Invalid name')

                        } else if (this.myForm.controls.email.invalid) {
                            this.snackbarService.showCustomSnackBarError('Invalid email format')

                        } else if (this.myForm.controls.contact.invalid) {
                            this.snackbarService.showCustomSnackBarError('Invalid phone number format')

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