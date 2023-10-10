import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import Swal from 'sweetalert2';
import { OrderIDService } from 'src/app/services/orderID.service';


@Component({
    selector: 'app-corporate',
    templateUrl: './corporae-order.component.html',
    styleUrls: ['./corporae-order.component.scss']
})
export class CorporateOrderListComponent implements OnInit, OnDestroy {

    skip = 0; // Initial value for skip
    limit = 5; // Initial value for limit
    data: any[] = [];

    totalCount = 0;
    currentPage: number = 1;
    paginationArray: number[] = [];
    searchQuery: string = '';
    filteredData: any[] = [];

    constructor(private service: AuthService, private router: Router, private route: ActivatedRoute, private orderService: OrderIDService) { }
    ngOnInit() {
        this.getCoporateOrderLists()
    }
    ngOnDestroy() {

    }
    
    filterData(): void {

    this.searchQuery = this.searchQuery.trim();
    if (this.searchQuery === '') {
        // If the search query is empty, show all data
        this.filteredData = this.data;
    } else {
        this.filteredData = this.data.filter((row) =>
            (typeof row.orderID === 'string' && row.orderID.includes(this.searchQuery)) ||
            row.invoiceTrackCreatedOn.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            row.invoiceTrackStatus.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
    }
}


    getCoporateOrderLists() {
        const user = JSON.parse(localStorage.getItem('user'))
        const corporateID = user.user_id;
        console.log(`=-=--=-user_id=-=-${corporateID}`)
        this.service.getL1UserOrderLists(this.skip, this.limit, '/v1/invoice/list_only_order_user_new/')
            .subscribe(
                (response) => {
                    console.log(' order details retrieved successfully:', response);
                    this.data = response.data;
                    this.totalCount = response.count;
                    this.currentPage = Math.ceil((this.skip + this.limit) / this.limit); // Update the current page based on skip and limit
                    this.paginationArray = this.getPaginationArray(this.totalCount, this.limit);
                    this.filterData(); // Apply initial filtering
                },
                (error) => {
                    console.error('Failed to get order details:', error);
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

        this.getCoporateOrderLists();
    }


    goToAddVendor() {
        this.router.navigateByUrl('/corporate-vendor-add');
    }
    navigateToVendorList() {
        this.router.navigateByUrl('/corporate-vendor');
    }
    view(row: any) {
        const numericID = parseInt(row.orderID, 10);
        this.orderService.orderID = numericID

        this.router.navigateByUrl('/order-list');
    }


}