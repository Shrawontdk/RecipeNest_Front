import {AfterViewInit, ChangeDetectorRef, Component, inject, OnDestroy} from '@angular/core';
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {HeaderComponent} from "../header/header.component";
import {MatSidenav, MatSidenavContainer, MatSidenavModule} from "@angular/material/sidenav";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {RouterOutlet} from "@angular/router";
import {MediaMatcher} from "@angular/cdk/layout";
import {MatButtonModule, MatIconButton} from "@angular/material/button";

@Component({
  selector: 'app-full',
  standalone: true,
  imports: [
    MatToolbar,
    MatIcon,
    HeaderComponent,
    MatSidenavContainer,
    SidebarComponent,
    RouterOutlet,
    MatSidenav,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './full.component.html',
  styleUrl: './full.component.scss'
})
export class FullComponent implements OnDestroy, AfterViewInit{
  mobileQuery: MediaQueryList;
  changeDetectorRef = inject(ChangeDetectorRef)
  media = inject(MediaMatcher)
  private _mobileQueryListener: () => void;

  constructor(  ) {
    this.mobileQuery = this.media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  ngAfterViewInit() { }
}
