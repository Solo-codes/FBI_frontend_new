import { Component, OnInit, OnDestroy, Input  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router, NavigationExtras } from '@angular/router';
import Swal from 'sweetalert2';
import { CorporateIDService } from 'src/app/services/corporateID.service';

@Component({
  selector: 'app-corporate-admin',
  templateUrl: './corporates-admin.component.html',
  styleUrls: ['./corporates-admin.component.scss']
})
export class CorporateAdminComponent implements OnInit, OnDestroy {
  skip = 0; // Initial value for skip
  limit = 5; // Initial value for limit
  data: any[] = [];
  totalCount = 0;
  currentPage: number = 1;
  paginationArray: number[] = [];
  searchQuery: string = '';
  filteredData: any[] = [];

  constructor(private service: AuthService, private router: Router,private corporateIDservice : CorporateIDService) { }

  ngOnInit(): void {
    this.getCoporateList();
  }

  ngOnDestroy(): void { }
  navigateToCorporatesAdd() {
    this.router.navigateByUrl('/corporates-add');
  }

  filterData(): void {
    this.searchQuery = this.searchQuery.trim();
    if (this.searchQuery.trim() === '') {
      // If the search query is empty, show all data
      this.filteredData = this.data;
    } else {
      this.filteredData = this.data.filter((row) =>
        row.FullName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        row.corporateEmail.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        row.corporateContact.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  getCorporateUserList(corporateID: string) {
    const numericID = parseInt(corporateID, 10); // Convert the string to a number
    console.log(`corporateID: ${numericID}`);

    this.corporateIDservice.corporateID = numericID

    this.router.navigateByUrl('/corporates-user');
  }
  updateCorporate(corporateID: string){
    const numericID = parseInt(corporateID, 10); // Convert the string to a number
    console.log(`corporateID: ${numericID}`);
    this.corporateIDservice.corporateID = numericID
    this.router.navigateByUrl('/corporates-update');
  }
  getCorporateVendorList(corporateID: string){
    const numericID = parseInt(corporateID, 10); // Convert the string to a number
    console.log(`corporateID: ${numericID}`);

    this.corporateIDservice.corporateID = numericID

    this.router.navigateByUrl('/corporates-vendor');
  }




  getCoporateList(): void {
    this.service.getCoporateList(this.skip, this.limit, '/v1/corporate/list_corporates/')
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

    this.getCoporateList();
  }

  deleteCorporate(corporateID: string){
    const numericID = parseInt(corporateID, 10); // Convert the string to a number
    console.log(`corporateID: ${numericID}`);
    Swal.fire({
      title: 'Are you sure?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: 'No',
  }).then((result) => {
      if (result.isConfirmed) {
          try {
              const data = {
                corporateID: corporateID,
              };
              this.service.put(data, '/v1/corporate/change_status_corporate/').subscribe(
                  (response) => {
                      // Handle the success response
                      const currentRoute = this.router.url;
                      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                          this.router.navigateByUrl(currentRoute);
                      });
                      

                  },
                  (error) => {
                      // Handle the error response
                      console.error('corporate update failed:', error);

                  }
              );

          } catch (error) {
              console.error(error);

          }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Cancelled', 'Not changed', 'error');
      }
  });
  }
}
