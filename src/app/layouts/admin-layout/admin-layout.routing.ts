import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { CorporateAdminComponent } from 'src/app/pages/corporates-admin/corporates-admin.component';
import { AddCorporateAdminComponent } from 'src/app/pages/add-corporate-admin/add-corporate-admin.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { CorporateUserAdminComponent } from 'src/app/pages/corporates-admin/corporate-user/corporate-user.component';
import { CorporateVendorAdminComponent } from 'src/app/pages/corporates-admin/corporate-vendor/corporate-vendor-admin.component';
import { CorporateVendorOrderAdminComponent } from 'src/app/pages/corporates-admin/corporate-vendor-order/corporate-vendor-order.component';
import { CorporateVendorOrderInvoicesAdminComponent } from 'src/app/pages/corporates-admin/corporate-vendor-order-invoices/corporate-vendor-order-invoice.component';
import { VendorAdminComponent } from 'src/app/pages/vendor-admin/vendor-admin.component';
import { AddVendorAdminComponent } from 'src/app/pages/vendor-admin/vendor-admin-add/vendor-admin-add.component';
import { CorporateComponent } from 'src/app/pages/corporate-vendor/corporate-vendor.components';
import { AddVendorCorporateComponent } from 'src/app/pages/corporate-vendor/add-vendor/add-vendor-corporate.component';
import { CorporateListVendorComponent } from 'src/app/pages/corporate-vendor/list-vendor/list-vendor-corporate.component';
import { CorporateOrderListComponent } from 'src/app/pages/corporate-order/corporae-order.component';
import { OrderViewComponent } from 'src/app/pages/corporate-order/view-order-corporate/view-order-corporate.component';
import { CorporateUserComponent } from 'src/app/pages/corporate-user/corporate-user.component';
import { AddUserCorporateComponent } from 'src/app/pages/corporate-user/add-corporate-user/add-corporate-user.component';
import { UpdateUserCorporateComponent } from 'src/app/pages/corporate-user/add-corporate-user/update-corporate-user/update-corporate-user.component';
import { L1UserComponent } from 'src/app/pages/l1-user-orders/l1-user-orders.component';
import { OrderL1userViewComponent } from 'src/app/pages/l1-user-orders/l1-user-order-view/l1-user-order-view.component';
import { L1BulkUploadCorporateComponent } from 'src/app/pages/l1-user-orders/l1-user-bulkUpload/l1-user-bulkUpload.components';
import { L1createOrderCorporateComponent } from 'src/app/pages/l1-user-orders/place-order/place-order.compoent';
import { LxUserComponent } from 'src/app/pages/lx-user-order/lx-user-order.component';
import { OrderLxuserViewComponent } from 'src/app/pages/lx-user-order/lx-user-orders-view/lx-user-orders-view.component';
import { UpdateCorporateAdminComponent } from 'src/app/pages/update-corporate-admin/update-corporate-admin.component';
export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent, title: 'Dashboard' } ,
    { path: 'corporates-list', component: CorporateAdminComponent, title: 'Corporate'  },
    { path: 'corporates-add', component: AddCorporateAdminComponent,  title: 'Corporate' } ,
    { path: 'corporates-update', component: UpdateCorporateAdminComponent, title: 'Corporate' } ,
    { path: 'corporates-user', component: CorporateUserAdminComponent,title: 'Corporate' },
    { path: 'corporates-vendor', component: CorporateVendorAdminComponent,  title: 'Corporate' },
    { path: 'corporates-vendor-orders', component: CorporateVendorOrderAdminComponent,  title: 'Orders'  },
    { path: 'corporates-vendor-order-invoices', component: CorporateVendorOrderInvoicesAdminComponent, title: 'Invoices' },
    { path: 'vendor-admin', component: VendorAdminComponent,  title: 'Vendor' },
    { path: 'vendor-admin-add', component: AddVendorAdminComponent, title: 'Vendor'  },
    { path: 'corporate-vendor', component: CorporateComponent, title: 'Vendor'  },
    { path: 'corporate-vendor-add', component: AddVendorCorporateComponent, title: 'Vendor'  },
    { path: 'corporate-vendor-list', component: CorporateListVendorComponent, title: 'Vendor' },
    { path: 'corporate-order-list', component: CorporateOrderListComponent,  title: 'Order' },
    { path: 'order-list', component: OrderViewComponent, title: 'Orders'  },
    { path: 'coroporate-user', component: CorporateUserComponent, title: 'User'  },
    { path: 'add-coroporate-user', component: AddUserCorporateComponent, title: 'User'  },
    { path: 'update-coroporate-user', component: UpdateUserCorporateComponent, title: 'User'  },
    { path: 'l1-user-orders', component: L1UserComponent,title: 'Orders'  },
    { path: 'l1-user-orders-view', component: OrderL1userViewComponent, title: 'Order'  },
    { path: 'l1-user-bulkUpload', component: L1BulkUploadCorporateComponent,  title: 'Upload' },
    { path: 'l1-user-createaorder', component: L1createOrderCorporateComponent,  title: 'Create Order'  },
    { path: 'lx-user-order', component: LxUserComponent, title: 'Order' },
    { path: 'lx-user-order-view', component: OrderLxuserViewComponent, title: 'Order'  }
];



