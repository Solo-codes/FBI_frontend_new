import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import Swal from 'sweetalert2';
import { OrderIDService } from 'src/app/services/orderID.service';
import * as XLSX from 'xlsx';


@Component({
    selector: 'app-lx-user',
    templateUrl: './lx-user-orders-view.component.html',
    styleUrls: ['./lx-user-orders-view.component.scss']
})
export class OrderLxuserViewComponent implements OnInit, OnDestroy {

    skip = 0; // Initial value for skip
    limit = 5; // Initial value for limit
    data: any[] = [];

    totalCount = 0;
    totalPages = 0;
    currentPage: number = 1;
    paginationArray: number[] = [];
    searchQuery: string = '';
    filteredData: any[] = [];
    user: any = JSON.parse(localStorage.getItem('user'));
    User_Level: number = parseInt(this.user.user_level);
    user_lvl: boolean



    constructor(private service: AuthService, private router: Router, private route: ActivatedRoute, private orderService: OrderIDService) { }
    ngOnInit() {
        this.getUser()
        this.getOrder()

    }
    ngOnDestroy() {

    }

    getUser() {
        this.service.getCurrentUser("v1/current_user/get_current_user/").subscribe(
            (response) => {
                // Handle the success response

                this.user_lvl = response.data.last_user;
                console.log('userlvl:', this.user_lvl);

            },
            (error) => {
                // Handle the error response
                console.error('Failed to get user details:', error);
                // Display error message

            }
        );
    }
    filterData(): void {
        this.searchQuery = this.searchQuery.trim();

        if (this.searchQuery.trim() === '') {
            // If the search query is empty, show all data
            this.filteredData = this.data;
        } else {
            this.filteredData = this.data.filter((row) =>
                (typeof row.invoiceNO === 'string' && row.invoiceNO.includes(this.searchQuery)) ||
                row.invoiceAmount.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                row.invoiceStatus.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                row.invoiceCreatedOn.toLowerCase().includes(this.searchQuery.toLowerCase())

            );

        }
    }

    getOrder() {
        const orderID = this.orderService.orderID
        console.log(`=-=--=-orderID=-=-${orderID}`)



        this.service.getOrder(orderID, this.skip, this.limit, '/v1/invoice/filter_order_by_orderID/')
            .subscribe(
                (response) => {
                    console.log(' order details retrieved successfully:', response);
                    this.data = response.data;
                    this.totalCount = response.count;
                    this.totalPages = Math.ceil(this.totalCount / this.limit);

                    this.currentPage =Math.ceil((this.skip + this.limit) / this.limit);Math.ceil((this.skip + 1) / this.limit);// Update the current page based on skip and limit
                    this.paginationArray = this.getPaginationArray(this.totalCount, this.limit);
                    this.filterData(); // Apply initial filtering
                },
                (error) => {
                    console.error('Failed to get order details:', error);
                }
            );
    }
    isBulkApproveVisible(): boolean {
        return this.filteredData.every(row => row.invoiceStatus !== 'INVOICE DOCUMENT NEED TO UPLOAD' && row.invoiceStatus !== 'REJECTED');
      }
      

    getPaginationArray(totalCount: number, limit: number): number[] {
        const pageCount = Math.ceil(totalCount / limit);
        const paginationArray = [];

        for (let i = 1; i <= pageCount; i++) {
            paginationArray.push(i);
        }

        return paginationArray;
    }

    goToPage(pageNumber: number | 'previous' | 'next'): void {
        if (pageNumber === 'previous') {
            if (this.skip >= this.limit) {
                this.skip -= this.limit;
            } else {
                this.skip = 0;
            }
        } else if (pageNumber === 'next') {
            this.skip += this.limit;
        } else {
            this.skip = (pageNumber - 1) * this.limit;
        }

        this.getOrder();
    }

    navigateToOrderList() {
        this.router.navigateByUrl('/lx-user-order');
    }

    ewayBill(row: any) {
        let html_data = "";
        let data = row.ewayBill
        if (data === 'Waiting for document upload') {
            html_data = `<span style="text-align: center; display: block;">${data}</span>`
        }
        else {
            html_data = `<span style="text-align: left; display: block;">${data}</span>`
        }
        Swal.fire({
            title: "Eway Bill",
            html: html_data,
            // showCancelButton: true,
            confirmButtonColor: "#010b8e",
            cancelButtonColor: "#d33",
            confirmButtonText: "Close",
        }).then((result) => {
            if (result.isConfirmed) {
                // this.router.navigate(["/pages/orders"]);
            } else {
                // this.router.navigate(["/pages/orders"]);

            }
        });
    }

    invoiceNoChecker(row: any) {
        let html_data = "";
        let data = row.invoiceNoChecker
        if (data === 'Waiting for document upload') {
            html_data = `<span style="text-align: center; display: block;">${data}</span>`
        }
        else {
            html_data = `<span style="text-align: left; display: block;">${data}</span>`
        }
        Swal.fire({
            title: "Invoice",
            html: html_data,
            // showCancelButton: true,
            confirmButtonColor: "#010b8e",
            cancelButtonColor: "#d33",
            confirmButtonText: "Close",
        }).then((result) => {
            if (result.isConfirmed) {
                // this.router.navigate(["/pages/orders"]);
            } else {
                // this.router.navigate(["/pages/orders"]);

            }
        });
    }

    viewDocumentInvoice(row: any) {
        this.service.viewDocumentInvoice(row.invoiceID, row.ext, '/v1/invoice/view_document_invoice/')
            .subscribe(
                (response) => {
                    console.log('order invoice downloaded successfully:', response);
                    if (response.code === "200") {
                        const presignedURL = response.data;
                        console.log("Data URL =", presignedURL);
                        const iframe = document.createElement('iframe');
                        iframe.src = presignedURL;
                        iframe.style.width = '100%';
                        iframe.style.height = '500px';
                        document.body.appendChild(iframe);
                    }
                },
                (error) => {
                    console.error('Failed to get details:', error);
                }
            );
    }
    Approve(row: any) {
        const invoiceID = row.invoiceID
        Swal.fire({
            title: 'Approve Invoice?',
            text: '',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: 'No',
        }).then((result) => {
            if (result.isConfirmed) {
                try {

                    this.service.Approve(invoiceID, '/v1/invoice/Approve_document_invoice/').subscribe(
                        (response) => {
                            // Handle the success response
                            const currentRoute = this.router.url;
                            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                                this.router.navigateByUrl(currentRoute);
                            });


                        },
                        (error) => {
                            // Handle the error response
                            console.error('Approve failed:', error);

                        }
                    );

                } catch (error) {
                    console.error(error);

                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Cancelled', 'Not Approved', 'error');
            }
        });
    }
    reject(row: any) {
        const invoiceID = row.invoiceID
        Swal.fire({
            title: 'Reject Invoice?',
            text: '',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: 'No',
        }).then((result) => {
            if (result.isConfirmed) {
                try {

                    this.service.Approve(invoiceID, '/v1/invoice/reject_document_invoice/').subscribe(
                        (response) => {
                            // Handle the success response
                            const currentRoute = this.router.url;
                            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                                this.router.navigateByUrl(currentRoute);
                            });


                        },
                        (error) => {
                            // Handle the error response
                            console.error('reject failed:', error);

                        }
                    );

                } catch (error) {
                    console.error(error);

                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Cancelled', 'Not rejected', 'error');
            }
        });
    }

    getCompletedRows(): any[] {
        return this.data.filter(row => row.invoiceStatus === 'COMPLETED');
    }

    generateExcelFile(): void {
        const completedRows = this.getCompletedRows();

        const excelData = completedRows.map(row => ({
            invoiceNO: row.invoiceNO,
            vendorID: row.vendorID,
            vendorName: row.vendorName,
            orderID: row.orderID,
            invoiceAmount: row.invoiceAmount,
            invoiceStatus: row.invoiceStatus,
            financeAmount: row.financeAmount
        }));

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(excelData);

        XLSX.utils.book_append_sheet(workbook, worksheet, 'data');

        const requests = completedRows.map(row => {
            return this.service.viewDocumentInvoice(row.invoiceID, row.ext, '/v1/invoice/view_document_invoice/').toPromise();
        });

        Promise.all(requests)
            .then(responses => {
                responses.forEach((response, index) => {
                    if (response.code === '200') {
                        const presignedURL = response.data;
                        const iframe = document.createElement('iframe');
                        iframe.src = presignedURL;
                        iframe.style.width = '100%';
                        iframe.style.height = '500px';
                        document.body.appendChild(iframe);
                    }
                });

                const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

                const anchor = document.createElement('a');
                anchor.href = window.URL.createObjectURL(data);
                anchor.download = 'order.xlsx';

                anchor.click();
                anchor.remove();
            })
            .catch(error => {
                console.error('Failed to get document details:', error);
            });
    }


    bulkApprove() {
        const orderID = this.orderService.orderID;
        const dangerAlert = document.getElementById('dangerAlert');
        const alertMessage = document.getElementById('alertMessage');

        Swal.fire({
            title: 'Approve Orders?',
            text: '',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    this.service.bulkApprove(orderID, '/v1/invoice/approve_bulk_invoice/').subscribe(
                        (response) => {
                            // Handle the success response
                            console.log('approve response:', response);
                            if (response.code === '200') {

                                Swal.fire({
                                    position: 'top-end',
                                    icon: 'success',
                                    title: 'You approved all invoices',
                                    showConfirmButton: false,
                                    timer: 1500
                                }).then(() => {
                                    // Refresh the current router
                                    const currentRoute = this.router.url;
                                    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                                        this.router.navigateByUrl(currentRoute);
                                    });

                                });
                                console.log('Orders approved successfully!');
                            } else if (response.code === '500') {
                                if (dangerAlert && alertMessage) {
                                    alertMessage.innerText = response.login;
                                    dangerAlert.style.display = 'block';
                                }
                            } else {
                                if (dangerAlert && alertMessage) {
                                    alertMessage.innerText = response.txt;
                                    dangerAlert.style.display = 'block';
                                }
                            }
                        },
                        (error) => {
                            // Handle the error response
                            console.error('bulk approve failed:', error);
                            if (dangerAlert && alertMessage) {
                                alertMessage.innerText = 'An error occurred during bulk approval';
                                dangerAlert.style.display = 'block';
                            }
                        }
                    );
                } catch (error) {
                    console.error(error);
                    if (dangerAlert && alertMessage) {
                        alertMessage.innerText = error;
                        dangerAlert.style.display = 'block';
                    }
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Cancelled', 'Bulk approval cancelled', 'error');
            }
        });

    }
}