import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import Swal from 'sweetalert2';
import { UserIDService } from 'src/app/services/userID.service';
import { Location } from '@angular/common';
import { OrderIDService } from 'src/app/services/orderID.service';

@Component({
    selector: 'app-user-l1',
    templateUrl: './lx-user-order.component.html',
    styleUrls: ['./lx-user-order.component.scss']
})
export class LxUserComponent implements OnInit, OnDestroy {
    skip = 0; // Initial value for skip
    limit = 5; // Initial value for limit
    data: any[] = [];

    totalCount = 0;
    totalPages = 0;
    currentPage: number = 1;
    paginationArray: number[] = [];
    searchQuery: string = '';
    filteredData: any[] = [];
   
    constructor(private service: AuthService, private router: Router, private route: ActivatedRoute, private orderService: OrderIDService) { }
    ngOnInit() {
       
        this.getL1UserOrderLists()
    }
    ngOnDestroy() {

    }


    
    filterData(): void {
        this.searchQuery = this.searchQuery.trim();
 // Trim spaces from the beginning of the search query

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


    getL1UserOrderLists() {

        this.service.getL1UserOrderLists(this.skip, this.limit, '/v1/invoice/list_only_order_user_new/')
            .subscribe(
                (response) => {
                    console.log(' order details retrieved successfully:', response);
                    this.data = response.data;
                    this.totalCount = response.count;
                    this.totalPages = Math.ceil(this.totalCount / this.limit);

                    this.currentPage = Math.ceil((this.skip + this.limit) / this.limit);Math.ceil((this.skip + 1) / this.limit); // Update the current page based on skip and limit
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

        this.getL1UserOrderLists();
    }

    view(row: any) {
        const numericID = parseInt(row.orderID, 10);
        this.orderService.orderID = numericID

        this.router.navigateByUrl('/lx-user-order-view');
    }
}