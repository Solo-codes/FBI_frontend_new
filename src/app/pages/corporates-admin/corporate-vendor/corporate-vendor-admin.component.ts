import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import Swal from 'sweetalert2';
import { CorporateIDService } from 'src/app/services/corporateID.service';
import { VendorIDService } from 'src/app/services/vendorID.service';

@Component({
    selector: 'app-corporate-vendor-admin',
    templateUrl: './corporate-vendor-admin.component.html',
    styleUrls: ['./corporate-vendor-admin.component.scss']
})


export class CorporateVendorAdminComponent implements OnInit, OnDestroy {

    skip = 0; // Initial value for skip
    limit = 5; // Initial value for limit
    data: any[] = [];

    totalCount = 0;
    totalPages = 0;
    currentPage: number = 1;
    paginationArray: number[] = [];
    searchQuery: string = '';
    filteredData: any[] = [];

    constructor(private service: AuthService, private router: Router, private route: ActivatedRoute, private corporateIDservice : CorporateIDService,private vendorIDService : VendorIDService) { }

    ngOnInit(){
        this.getCoporateVendorList();
    }
    ngOnDestroy(){
        
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

    navigateToCorporatesList() {
        this.router.navigateByUrl('/corporates-list');
      }

    getCorporateOrderList(vendorID: string) {
        const numericID = parseInt(vendorID, 10); // Convert the string to a number
        console.log(`corporateID: ${numericID}`);
    
        this.vendorIDService.vendorID = numericID
    
        this.router.navigateByUrl('/corporates-vendor-orders');
      }
      getCoporateVendorList() {
        const corporateID = this.corporateIDservice.corporateID
        console.log('corporateID2:', corporateID);
        this.service.getCoporateVendorList(corporateID, this.skip, this.limit, '/v1/vendor/list_corporate_vendors/')
            .subscribe(
                (response) => {
                    console.log('Corporate vendor details retrieved successfully:', response);
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

        this.getCoporateVendorList();
    }
}