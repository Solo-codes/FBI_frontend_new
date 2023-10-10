import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import Swal from 'sweetalert2';
import { CorporateIDService } from 'src/app/services/corporateID.service';
import { OrderIDService } from 'src/app/services/orderID.service';

@Component({
    selector: 'app-corporate-vendor-admin-orders',
    templateUrl: './corporate-vendor-order-invoice.component.html',
    styleUrls: ['./corporate-vendor-order-invoice.component.scss']
})
export class CorporateVendorOrderInvoicesAdminComponent implements OnInit, OnDestroy {

    skip = 0; // Initial value for skip
    limit = 5; // Initial value for limit
    data: any[] = [];

    totalCount = 0;
    totalPages = 0;
    currentPage: number = 1;
    paginationArray: number[] = [];
    searchQuery: string = '';
    filteredData: any[] = [];


    constructor(private service: AuthService, private router: Router, private route: ActivatedRoute, private corporateIDservice: CorporateIDService, private orderIDservice: OrderIDService) { }

    ngOnInit() {
        this.listOrderInvoiceOfVendors()
    }
    ngOnDestroy() {

    }

    filterData(): void {
        this.searchQuery = this.searchQuery.trim();

        if (this.searchQuery.trim() === '') {
            // If the search query is empty, show all data
            this.filteredData = this.data;
        } else {
            this.filteredData = this.data.filter((row) =>
                row.invoiceNO.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                row.invoiceStatus.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                row.invoiceAmount.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        }
    }

    navigateToCorporatesVendorOrderList() {
        this.router.navigateByUrl('/corporates-vendor-orders');
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
            title: "Eway",
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
                    console.log('Corporate vendor order invoice downloaded successfully:', response);
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


    listOrderInvoiceOfVendors() {
        const orderID = this.orderIDservice.orderID
        const corporateID = this.corporateIDservice.corporateID
        console.log('vendorID:', orderID);
        this.service.listOrderInvoiceOfVendors(corporateID, orderID, this.skip, this.limit, '/v1/invoice/filter_order_by_orderID_admin/')
            .subscribe(
                (response) => {
                    console.log('Corporate vendor order invoice details retrieved successfully:', response);
                    this.data = response.data;
                    this.totalCount = response.Total_count;
                    this.totalPages = Math.ceil(this.totalCount / this.limit);

                    this.currentPage = Math.ceil((this.skip + this.limit) / this.limit);Math.ceil((this.skip + 1) / this.limit); // Update the current page based on skip and limit
                    this.paginationArray = this.getPaginationArray(this.totalCount, this.limit);
                    this.filterData(); // Apply initial filtering
                },
                (error) => {
                    console.error('Failed to get details:', error);
                }
            );
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

        this.listOrderInvoiceOfVendors();
    }
}