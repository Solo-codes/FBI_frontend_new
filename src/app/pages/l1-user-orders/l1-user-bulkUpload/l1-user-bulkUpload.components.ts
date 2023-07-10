import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { OrderIDService } from 'src/app/services/orderID.service';
import Swal from 'sweetalert2';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
    selector: 'app-user',
    templateUrl: './l1-user-bulkUpload.components.html',
    styleUrls: ['./l1-user-bulkUpload.components.scss']
})
export class L1BulkUploadCorporateComponent implements OnInit, OnDestroy {
    myForm: FormGroup;
    selectedFiles: File[] = [];
    notUploadedDocuments: any;
    showNotUploadedFiles: boolean = false;



    constructor(private router: Router, private fb: FormBuilder, private orderService: OrderIDService, private service: AuthService, private snackbarService: SnackbarService) { }

    ngOnInit() {
        this.initializeForm();
    }

    ngOnDestroy() { }

    initializeForm() {
        this.myForm = this.fb.group({
            files: [[], Validators.required]
        });
    }


    onFileChange(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        if (inputElement.files && inputElement.files.length) {
            const validFiles: File[] = [];
            const invalidFiles: File[] = [];

            for (let i = 0; i < inputElement.files.length; i++) {
                const file = inputElement.files[i];
                if (file.type === 'application/pdf') {
                    validFiles.push(file);
                } else {
                    invalidFiles.push(file);
                }
            }

            this.selectedFiles = validFiles;
            this.myForm.patchValue({ files: this.selectedFiles }); // Update the form control value

            if (invalidFiles.length > 0) {
                // Show error message or handle invalid files as needed
                console.log('Invalid files:', invalidFiles);
            }
        } else {
            this.selectedFiles = [];
            this.myForm.patchValue({ files: [] }); // Update the form control value
        }
    }



    removeFile(file: File) {
        this.selectedFiles = this.selectedFiles.filter(f => f !== file);
        const filesInput = document.getElementById('filesInput') as HTMLInputElement;
        filesInput.value = ''; // Reset the value of the file input
        this.updateFileInput(filesInput);
    }

    navigateToOrderist(event: Event) {
        event.preventDefault(); // Prevent the default behavior of the link
        this.router.navigateByUrl('/l1-user-orders-view');
    }

    updateFileInput(input: HTMLInputElement) {
        const dataTransfer = new DataTransfer();
        this.selectedFiles.forEach((file: any) => {
            dataTransfer.items.add(file);
        });
        input.files = dataTransfer.files;
    }

    upload() {
        const orderID = this.orderService.orderID;

        Swal.fire({
            title: 'Upload Files?',
            text: '',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    if (this.myForm.valid) {
                        const formData = new FormData();
                        formData.append('orderID', orderID.toString());

                        for (let file of this.selectedFiles) {
                            formData.append('files', file);
                        }

                        this.service.post(formData, '/v1/invoice/upload_document_invoice/').subscribe(
                            (response) => {
                                // Handle the success response
                                console.log('create response:', response);
                                if (response.code === '200') {
                                    this.notUploadedDocuments = response.notUploded;
                                    this.showNotUploadedFiles = this.notUploadedDocuments.length > 0

                                    console.log(`=-=-=-=notuploaded=-=-${this.notUploadedDocuments}`)
                                    // Reset the form and selectedFiles
                                    this.myForm.reset();
                                    this.selectedFiles = [];
                                    console.log('Files uploaded successfully!');
                                    this.snackbarService.showCustomSnackBarSuccess('Files uploaded successfully!')

                                } else if (response.code === '500') {

                                    this.snackbarService.showCustomSnackBarError(response.upload_document_invoice)

                                } else {

                                    this.snackbarService.showCustomSnackBarError(response.upload_document_invoice)

                                }
                            },
                            (error) => {
                                // Handle the error response
                                console.error('file upload failed:', error);

                                this.snackbarService.showCustomSnackBarError('An error occurred during file upload')

                            }
                        );
                    } else {

                        this.snackbarService.showCustomSnackBarError('Invalid File')


                    }
                } catch (error) {
                    console.error(error);
                    this.snackbarService.showCustomSnackBarError(error)

                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Cancelled', 'Not Uploaded', 'error');
            }
        });
    }




}
