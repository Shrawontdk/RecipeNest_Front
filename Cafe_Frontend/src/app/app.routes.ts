import {Routes} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {FullComponent} from "./layouts/full/full.component";
import {RouteGuardService} from "./services/authenitication/route-guard.service";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {CategoryService} from "./services/category.service";
import {ManageCategoryComponent} from "./manage-category/manage-category.component";
import {ManageProductComponent} from "./manage-product/manage-product.component";
import {ManageOrderComponent} from "./manage-order/manage-order.component";
import {ViewBillComponent} from "./view-bill/view-bill.component";
import {ManageUserComponent} from "./manage-user/manage-user.component";

export const routes: Routes = [

  {path: '', component: HomeComponent},
  {
    path: 'cafe',
    component: FullComponent,
    canActivate: [RouteGuardService],
    children: [
      {
        path: '',
        redirectTo: '/cafe/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'category',
        component: ManageCategoryComponent,
      },
      {
        path: 'product',
        component: ManageProductComponent,
      },
      {
        path: 'order',
        component: ManageOrderComponent,
      },
      {
        path: 'bill',
        component: ViewBillComponent,
      },
      {
        path: 'user',
        component: ManageUserComponent,
      },
    ]
  },

  {path: '**', component: HomeComponent}
];
