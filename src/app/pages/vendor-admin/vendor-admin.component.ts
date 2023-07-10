import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router, NavigationExtras } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-vendor-admin',
    templateUrl: './vendor-admin.component.html',
    styleUrls: ['./vendor-admin.component.scss']
})
export class VendorAdminComponent implements OnInit, OnDestroy {

    skip = 0; // Initial value for skip
    limit = 5; // Initial value for limit
    data: any[] = [];
    totalCount = 0;
    currentPage: number = 1;
    paginationArray: number[] = [];
    searchQuery: string = '';
    filteredData: any[] = [];


    constructor(private service: AuthService, private router: Router) { }
    ngOnInit() {
        this.getVendorList()
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
                row.vendorEmail.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                row.vendorContact.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        }
    }

    addVendorAdmin() {
    
        this.router.navigateByUrl('/vendor-admin-add');
      }

    getVendorList(): void {
        this.service.getVendorList(this.skip, this.limit, '/v1/vendor/list_vendors/')
            .subscribe(
                (response) => {
                    console.log('Corporate details retrieved successfully:', response);
                    this.data = response.data;
                    this.totalCount = response.Total_count;
                    this.currentPage = Math.ceil((this.skip + this.limit) / this.limit); // Update the current page based on skip and limit
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

        this.getVendorList();
    }


}