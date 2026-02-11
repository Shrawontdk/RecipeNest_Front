import {ChangeDetectorRef, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {MediaMatcher} from "@angular/cdk/layout";
import {LocalStorageUtil} from "../../utils/local-storage-utils";
import {MenuItems} from "../../shared/menu-items";
import {jwtDecode} from "jwt-decode";
import {MatListItem, MatListModule, MatNavList} from "@angular/material/list";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {AccordionLinkDirective} from "../../shared/accordionlink.directive";
import {AccordionDirective} from "../../shared/accordian.directive";
import {AccordionAnchorDirective} from "../../shared/accordionanchor.directive";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    MatNavList,
    MatListItem,
    RouterLinkActive,
    RouterLink,
    MatListModule,
    AccordionLinkDirective,
    AccordionDirective,
    AccordionAnchorDirective,
    CommonModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit,OnDestroy {
  mobileQuery: MediaQueryList | undefined;
  private _mobileQueryListener: () => void = () => {};
  userRole: any;
  token: any = LocalStorageUtil.getStorage().at;
  tokenPayload: any;
  changeDetectorRef = inject(ChangeDetectorRef);
  media = inject(MediaMatcher);
  constructor(public menuItems: MenuItems) { }
  ngOnInit() {
    this.tokenPayload = jwtDecode(this.token);
    this.userRole = this.tokenPayload?.role;
    this.mobileQuery = this.media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy() {
    if (this.mobileQuery) {
      this.mobileQuery.removeListener(this._mobileQueryListener);
    }
  }
}
