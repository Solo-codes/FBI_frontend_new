import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import Swal from 'sweetalert2';
import { SnackbarService } from 'src/app/services/snackbar.service';


@Component({
    selector: 'app-corporate',
    templateUrl: './list-vendor-corporate.component.html',
    styleUrls: ['./list-vendor-corporate.component.scss']
})
export class CorporateListVendorComponent implements OnInit, OnDestroy {

    skip = 0; // Initial value for skip
    limit = 5; // Initial value for limit
    data: any[] = [];

    totalCount = 0;
    currentPage: number = 1;
    paginationArray: number[] = [];
    searchQuery: string = '';
    filteredData: any[] = [];

    constructor(private service: AuthService, private router: Router, private route: ActivatedRoute,private snackbarService: SnackbarService
        ) { }
    ngOnInit() {
        this.getCoporateVendorLists()
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
                row.vendorEmail.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                row.vendorContact.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                row.vendorName.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        }
    }

    getCoporateVendorLists() {

        this.service.getCoporateVendorLists(this.skip, this.limit, '/v1/vendor/list_vendors/')
            .subscribe(
                (response) => {
                    console.log(' vendor details retrieved successfully:', response);
                    this.data = response.data;
                    this.totalCount = response.Total_count;
                    this.currentPage = Math.ceil((this.skip + this.limit) / this.limit); // Update the current page based on skip and limit
                    this.paginationArray = this.getPaginationArray(this.totalCount, this.limit);
                    this.filterData(); // Apply initial filtering
                },
                (error) => {
                    console.error('Failed to get vendor details:', error);
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

        this.getCoporateVendorLists();
    }


    goToAddVendor() {
        this.router.navigateByUrl('/corporate-vendor-add');
    }
    navigateToVendorList(){
        this.router.navigateByUrl('/corporate-vendor');
    }


    link(row: any) {
        const vendorID = row.vendorID
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to link vendor!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
          }).then((result) => {
            if (result.isConfirmed) {
        this.service.linkVendor(vendorID, '/v1/vendor/link_vendor/')
        .subscribe(
            (response) => {
                console.log(' vendor linked successfully:', response);
                this.data = response.data;
                
                if (response.code === "200") {
                    this.snackbarService.showCustomSnackBarSuccess('linked successfully')
                }
                  else{
                    

                      this.snackbarService.showCustomSnackBarError(response.link_vendor)
                  }
                
            },
            (error) => {
                console.error('Failed to link vendor :', error);
            }
        );

    } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Delete operation cancelled
        Swal.fire('Cancelled', 'Vendor linking cancelled', 'error');
      }
    });
    }
}