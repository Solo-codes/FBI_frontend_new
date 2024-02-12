import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

//interceptor
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Interceptor } from './services/interceptor';
// import { LoadingInterceptor } from './services/loadingInterceptor';
//end
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { LoaderComponent } from './components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { CorporateAdminComponent } from './pages/corporates-admin/corporates-admin.component';
import { AddCorporateAdminComponent } from './pages/add-corporate-admin/add-corporate-admin.component';
import { CorporateUserAdminComponent } from './pages/corporates-admin/corporate-user/corporate-user.component';
import { CorporateVendorAdminComponent } from './pages/corporates-admin/corporate-vendor/corporate-vendor-admin.component';
import { CorporateVendorOrderAdminComponent } from './pages/corporates-admin/corporate-vendor-order/corporate-vendor-order.component';
import { CorporateVendorOrderInvoicesAdminComponent } from './pages/corporates-admin/corporate-vendor-order-invoices/corporate-vendor-order-invoice.component';
import { VendorAdminComponent } from './pages/vendor-admin/vendor-admin.component';
import { AddVendorAdminComponent } from './pages/vendor-admin/vendor-admin-add/vendor-admin-add.component';
import { CorporateComponent } from './pages/corporate-vendor/corporate-vendor.components';
import { AddVendorCorporateComponent } from './pages/corporate-vendor/add-vendor/add-vendor-corporate.component';
import { CorporateListVendorComponent } from './pages/corporate-vendor/list-vendor/list-vendor-corporate.component';
import { CorporateOrderListComponent } from './pages/corporate-order/corporae-order.component';
import { OrderViewComponent } from './pages/corporate-order/view-order-corporate/view-order-corporate.component';
import { CorporateUserComponent } from './pages/corporate-user/corporate-user.component';
import { AddUserCorporateComponent } from './pages/corporate-user/add-corporate-user/add-corporate-user.component';
import { UpdateUserCorporateComponent } from './pages/corporate-user/add-corporate-user/update-corporate-user/update-corporate-user.component';
import { L1UserComponent } from './pages/l1-user-orders/l1-user-orders.component';
import { OrderL1userViewComponent } from './pages/l1-user-orders/l1-user-order-view/l1-user-order-view.component';
import { L1BulkUploadCorporateComponent } from './pages/l1-user-orders/l1-user-bulkUpload/l1-user-bulkUpload.components';
import { L1createOrderCorporateComponent } from './pages/l1-user-orders/place-order/place-order.compoent';
import { LxUserComponent } from './pages/lx-user-order/lx-user-order.component';
import { OrderLxuserViewComponent } from './pages/lx-user-order/lx-user-orders-view/lx-user-orders-view.component';
import { UpdateCorporateAdminComponent } from './pages/update-corporate-admin/update-corporate-admin.component';
import { ToISTPipe } from './services/time.service';
@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,
    CommonModule ,
    ReactiveFormsModule,
    MatSnackBarModule,
    
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    LoaderComponent,
    CorporateAdminComponent,
    AddCorporateAdminComponent,
    CorporateUserAdminComponent,
    CorporateVendorAdminComponent,
    CorporateVendorOrderAdminComponent,
    CorporateVendorOrderInvoicesAdminComponent,
    VendorAdminComponent,
    AddVendorAdminComponent,
    CorporateComponent,
    AddVendorCorporateComponent,
    CorporateListVendorComponent,
    CorporateOrderListComponent,
    OrderViewComponent,
    CorporateUserComponent,
    AddUserCorporateComponent,
    UpdateUserCorporateComponent,
    L1UserComponent,
    OrderL1userViewComponent,
    L1BulkUploadCorporateComponent,
    L1createOrderCorporateComponent,
    LxUserComponent,
    OrderLxuserViewComponent,
    UpdateCorporateAdminComponent,
    ToISTPipe
  ],
  // providers: [
  //   {provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi:true},
  //   { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi:true }
  // ],
  
  providers: [
    // Other providers
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true
    }
    // },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: LoadingInterceptor,
    //   multi: true
    // }
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
