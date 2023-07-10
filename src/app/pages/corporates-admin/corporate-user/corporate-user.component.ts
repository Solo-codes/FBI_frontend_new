import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import Swal from 'sweetalert2';
import { CorporateIDService } from 'src/app/services/corporateID.service';


@Component({
    selector: 'app-corporate-user-admin',
    templateUrl: './corporate-user.component.html',
    styleUrls: ['./corporate-user.component.scss']
})

export class CorporateUserAdminComponent implements OnInit, OnDestroy {

    skip = 0; // Initial value for skip
    limit = 5; // Initial value for limit
    data: any[] = [];

    totalCount = 0;
    currentPage: number = 1;
    paginationArray: number[] = [];
    searchQuery: string = '';
    filteredData: any[] = [];
    

    
    constructor(private service: AuthService, private router: Router, private route: ActivatedRoute, private corporateIDservice : CorporateIDService) { }
    ngOnInit() {
        
        // Use the corporateID as needed in your component
        this.getCoporateUserList()
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
                row.userName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                row.userEmail.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                row.userContact.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        }
    }

    navigateToCorporatesList() {
        this.router.navigateByUrl('/corporates-list');
      }
     
    getCoporateUserList() {
        const corporateID = this.corporateIDservice.corporateID
        console.log('corporateID2:', corporateID);
        this.service.getCoporateUserList(corporateID, this.skip, this.limit, '/v1/users/get_users/')
            .subscribe(
                (response) => {
                    console.log('Corporate user details retrieved successfully:', response);
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

        this.getCoporateUserList();
    }
}