import { Component, OnInit, ElementRef } from '@angular/core';
import { AdminLayoutRoutes } from 'src/app/layouts/admin-layout/admin-layout.routing';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public focus;
  public listTitles: any[];
  public location: Location;
  public user_type: string;
  public user_name: string;
  public currentTitle: string;
  public currentRoute: string;

  constructor(
    location: Location,
    private element: ElementRef,
    private router: Router,
    private service: AuthService,
    private route: ActivatedRoute,
    private titleService: Title
  ) {
    this.location = location;
  }

  ngOnInit() {
    this.getCurrentRoute();
    this.updateCurrentTitle();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.getCurrentRoute();
        this.updateCurrentTitle();
      });

    this.listTitles = AdminLayoutRoutes.filter(listTitle => listTitle);

    this.service.getCurrentUser("v1/current_user/get_current_user/").subscribe(
      (response) => {
        console.log('user details getted success:', response);
        this.user_type = response.data.user_type;
        this.user_name = response.data.user_name;
      },
      (error) => {
        console.error('Failed to get user details:', error);
        Swal.fire({
          title: 'You need to login again',
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          }
        }).then(() => {
          try {
            this.service.logout().toPromise();
            this.router.navigate(['/login']);
            new Promise((resolve) => setTimeout(resolve, 100));
            window.location.reload();
          } catch (error) {
            console.error(error);
            this.router.navigate(['/login']);
          }
        });
      }
    );
  }

  getCurrentRoute() {
    this.currentRoute = this.route.snapshot['_routerState'].url;
    console.log('Current Route:', this.currentRoute);
  }

  updateCurrentTitle() {
    this.currentTitle = this.getTitle(this.currentRoute);
    console.log('Current Title:', this.currentTitle);
    this.titleService.setTitle(this.currentTitle);
  }

  getTitle(route: string): string {
    const dashboardRoute = '/dashboard'; // Assuming the dashboard route is '/dashboard'
    
    if (route === dashboardRoute) {
      return 'Dashboard';
    }
  
    if (this.listTitles && this.listTitles.length > 0) {
      const matchedRoute = this.listTitles.find((item) => route.includes(item.path));
      if (matchedRoute) {
        this.currentTitle = matchedRoute.title; // Set the currentTitle property to the matched route's title
        return matchedRoute.title;
      }
    }
    
    return this.titleService.getTitle();
  }
  

  logout() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are going to logout!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, I\'m sure!',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        try {
          this.service.logout().toPromise();
          this.router.navigate(['/login']);
          new Promise((resolve) => setTimeout(resolve, 100));
          window.location.reload();
        } catch (error) {
          console.error(error);
          this.router.navigate(['/login']);
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'You are still here :)', 'error');
      }
    });
  }
}
