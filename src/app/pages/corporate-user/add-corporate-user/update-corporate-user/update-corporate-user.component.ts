import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import Swal from 'sweetalert2';
import { UserIDService } from 'src/app/services/userID.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
    selector: 'app-add-user-corporate',
    templateUrl: './update-corporate-user.component.html',
    styleUrls: ['./update-corporate-user.component.scss']
})
export class UpdateUserCorporateComponent implements OnInit, OnDestroy {

    myForm: FormGroup;
    Level: string[] = [];
    data: any[] = [];
    user: any[] = [];

    constructor(private service: AuthService, private router: Router, private fb: FormBuilder, private userIdService: UserIDService, private snackbarService: SnackbarService) { }

    ngOnInit() {
        this.initializeForm();
        this.getCoporateUserGroups()
        this.getUserDetail()
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

            group: ['', Validators.required],

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

    getUserDetail() {
        const userID = this.userIdService.userID;
        this.service.getUserDetail(userID, '/v1/users/get_single_user/')
            .subscribe(
                (res) => {
                    this.user = res.data;
                    console.log('User details retrieved successfully:', this.user);
                    // Set the value of the "name" field in the form
                    this.myForm.get('name').setValue(this.user[0].userName);
                    this.myForm.get('email').setValue(this.user[0].userEmail);
                    this.myForm.get('contact').setValue(this.user[0].userContact);

                },
                (error) => {
                    console.error('Failed to get user details:', error);
                }
            );
    }


    updateUser() {
        const userID = this.userIdService.userID;

        Swal.fire({
            title: 'Update User?',
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
                            userID: userID,
                            corporateUserGroupID: this.myForm.get('group').value,
                            userName: this.myForm.get('name').value,
                            userContact: this.myForm.get('contact').value,
                            userEmail: this.myForm.get('email').value

                        };


                        this.service.put(data, '/v1/users/update_single_user/').subscribe(
                            (response) => {
                                // Handle the success response
                                console.log('update response:', response);
                                if (response.code === '200') {
                                    this.router.navigateByUrl('/coroporate-user');
                                    this.snackbarService.showCustomSnackBarSuccess('User update successfully!')

                                    // Reset the form
                                    this.myForm.reset();
                                    console.log('User update successfully!');
                                } else if (response.code === '500') {

                                    this.snackbarService.showCustomSnackBarError(response.get_users)

                                } else {
                                    this.snackbarService.showCustomSnackBarError(response.update_single_user)
                                }
                            },
                            (error) => {
                                // Handle the error response
                                console.error('user update failed:', error);

                                this.snackbarService.showCustomSnackBarError('An error occurred during update user')

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