import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import Swal from 'sweetalert2';
import { CorporateIDService } from 'src/app/services/corporateID.service';
import { VendorIDService } from 'src/app/services/vendorID.service';
import { OrderIDService } from 'src/app/services/orderID.service';

@Component({
    selector: 'app-corporate-vendor-admin-orders',
    templateUrl: './corporate-vendor-order.component.html',
    styleUrls: ['./corporate-vendor-order.component.scss']
})

export class CorporateVendorOrderAdminComponent implements OnInit, OnDestroy {
    skip = 0; // Initial value for skip
    limit = 5; // Initial value for limit
    data: any[] = [];

    totalCount = 0;
    totalPages = 0;
    currentPage: number = 1;
    paginationArray: number[] = [];
    searchQuery: string = '';
    filteredData: any[] = [];


    constructor(private service: AuthService, private router: Router, private route: ActivatedRoute, private corporateIDservice: CorporateIDService, private vendorIDservice: VendorIDService,private orderIDservice: OrderIDService) { }

    ngOnInit() {
        this.listOrdersOfVendors()
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
                row.vendorName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                row.invoiceTrackStatus.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        }
    }

    navigateToCorporatesVendorList() {
        this.router.navigateByUrl('/corporates-vendor');
    }

    getCorporateOrderInvoiceList(orderID: string) {
        const numericID = parseInt(orderID, 10); // Convert the string to a number
        console.log(`corporateID: ${numericID}`);
    
        this.orderIDservice.orderID = numericID
    
        this.router.navigateByUrl('/corporates-vendor-order-invoices');
      }

    listOrdersOfVendors() {
        const vendorID = this.vendorIDservice.vendorID
        const corporateID = this.corporateIDservice.corporateID
        console.log('vendorID:', vendorID);
        this.service.listOrdersOfVendors(vendorID, corporateID, this.skip, this.limit, '/v1/corporate/list_orders_of_vendores/')
            .subscribe(
                (response) => {
                    console.log('Corporate vendor order details retrieved successfully:', response);
                    this.data = response.data;
                    this.totalCount = response.Total_count;
                    this.totalPages = Math.ceil(this.totalCount / this.limit);

                    this.currentPage = Math.ceil((this.skip + this.limit) / this.limit);Math.ceil((this.skip + 1) / this.limit); // Update the current page based on skip and limit
                    this.paginationArray = this.getPaginationArray(this.totalCount, this.limit);
                    this.filterData(); // Apply initial filtering
                },
                (error) => {
                    console.error('Failed to get corporate details:', error);
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

        this.listOrdersOfVendors();
    }
}