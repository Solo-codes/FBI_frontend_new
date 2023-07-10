import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

let dynamicRoutes: RouteInfo[] = [];

export const ROUTES: RouteInfo[] = dynamicRoutes;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public menuItems: any[];
  public isCollapsed = true;
  public dynamicRoutes: any[];
  static dynamicRoutes: any[];

  constructor(private router: Router,private service: AuthService) {}

  ngOnInit() {
    this.loadMenuItems();

    // Subscribe to the 'storage' event to listen for changes in the 'user' localStorage value
    window.addEventListener('storage', this.handleStorageChange.bind(this));
  }

  
  

  loadMenuItems() {
    const user = JSON.parse(localStorage.getItem('user'));
    const defaultUserType = 'DEFAULT';

    if (user && user.user_type === 'ADMIN') {
      console.log(`=-=-=-user details=-=-=${user.user_type}`)
      dynamicRoutes = [
        { path: '/dashboard', title: 'Dashboard', icon: 'ni-tv-2 text-primary', class: 'side-icon'},
        { path: '/corporates-list', title: 'Corporates', icon: 'ni-badge text-primary', class: 'side-icon' },
        { path: '/vendor-admin', title: 'Vendors', icon: 'ni-briefcase-24 text-primary', class: 'side-icon' },
        { path: '/dashboard', title: 'Reports', icon: 'ni-calendar-grid-58 text-primary', class: 'side-icon' },
        { path: '/dashboard', title: 'Settings', icon: 'ni-settings-gear-65 text-primary', class: 'side-icon' }
      ];
    }
    else if(user && user.user_type === 'CORPORATE'){
      console.log(`=-=-=-user details=-=-=${user.user_type}`)
      dynamicRoutes = [
        { path: '/dashboard', title: 'Dashboard', icon: 'ni-tv-2 text-primary', class: 'side-icon' },
        { path: '/corporate-vendor', title: 'Vendors', icon: 'ni-briefcase-24 text-primary', class: 'side-icon' },
        { path: '/corporate-order-list', title: 'Orders', icon: 'ni ni-cart text-primary', class: 'side-icon' },
        { path: '/coroporate-user', title: 'Users', icon: 'ni-calendar-grid-58 text-primary', class: 'side-icon' },
        { path: '/dashboard', title: 'Settings', icon: 'ni-settings-gear-65 text-primary', class: 'side-icon' }
      ];
    }
    else if(user && user.user_type === 'USER' && user.user_level === 1){
      console.log(`=-=-=-user details:=-=-=Type: ${user.user_type}=-=Level: ${user.user_level}`)
      dynamicRoutes = [
        { path: '/dashboard', title: 'Dashboard', icon: 'ni-tv-2 text-primary', class: 'side-icon' },
        { path: '/l1-user-orders', title: 'Orders', icon: 'ni ni-cart text-primary', class: 'side-icon' },
        { path: '/l1-user-createaorder', title: 'Place Order', icon: 'ni ni-cart text-primary', class: 'side-icon' },
        { path: '/dashboard', title: 'Settings', icon: 'ni-settings-gear-65 text-primary', class: 'side-icon' }
      ];
    }
    else if(user && user.user_type === 'USER' && user.user_level > 1){
      console.log(`=-=-=-user details:=-=-=Type: ${user.user_type}=-=Level: ${user.user_level}`)
      dynamicRoutes = [
        { path: '/dashboard', title: 'Dashboard', icon: 'ni-tv-2 text-primary', class: 'side-icon' },
        { path: '/lx-user-order', title: 'Orders', icon: 'ni ni-cart text-primary', class: 'side-icon' },
        { path: '/dashboard', title: 'Settings', icon: 'ni-settings-gear-65 text-primary', class: 'side-icon' }
      ];
    }
    else {
      dynamicRoutes = [
        
      ];
    }

    this.menuItems = dynamicRoutes.filter(menuItem => menuItem);
  }

  handleStorageChange(event: StorageEvent) {
    if (event.key === 'user') {
      this.loadMenuItems();
    }
  }
  refreshPage() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/refresh', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
  ngOnDestroy() {
    // Unsubscribe from the 'storage' event when the component is destroyed
    window.removeEventListener('storage', this.handleStorageChange.bind(this));
  }

  logout() {
    console.log(`=-=logout clicked=--=`)
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are going to logout!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Logout',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        // Delete operation confirmed
        localStorage.clear();
        try {
          this.service.logout().toPromise();
          // this.toast.success("Logout Successful");
          this.router.navigate(["/login"]);
          new Promise((resolve) => setTimeout(resolve, 100));
          window.location.reload();
        } catch (error) {
          console.error(error);
          // this.toast.error("somthing bad happened!")
          this.router.navigate(['/login']);
        }
        // Redirect to the login page
        this.router.navigate(['/login']);
      // } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Delete operation cancelled
      //   Swal.fire('Cancelled', 'You are still here :)', 'error');
      // }
      }
    });
    
    // Clear local storage
   
  }
}
