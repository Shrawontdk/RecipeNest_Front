import {AfterViewInit, Component, inject, OnInit} from '@angular/core';
import {DashboardService} from "../services/dashboard.service";
import {ToastService} from "../services/ToastService";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {Alert, AlertType} from "../services/Alert";
import {GlobalConstants} from "../shared/global-constants";
import {MatCard} from "@angular/material/card";
import {RouterLink} from "@angular/router";
import {NgxChartsModule, PieChartModule} from "@swimlane/ngx-charts";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatCard,
    RouterLink,
    PieChartModule,
    JsonPipe,
    NgxChartsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  responseMessage: any;
  dashBoardService = inject(DashboardService);
  toastService = inject(ToastService);
  data: any;
  ngxUiLoaderService = inject(NgxUiLoaderService);
  view: [number, number] = [990, 400];
  colorScheme: any = {
    domain: ['#F45123', '#B523F4', '#10E9AE', '#2D23F4', '#ADD8E6', '#808000']
  };
  datas: { name: string, value: number }[] = [];

  ngOnInit() {
    this.ngxUiLoaderService.start();
    this.dashBoardData();

  }

  ngAfterViewInit() {
  }

  private dashBoardData() {
    this.dashBoardService.getDetails().subscribe(
      (response: any) => {
        this.data = response;
        this.datas = [
          { name: "Product", value: this.data.product },
          { name: "Bill", value: this.data.bill },
          { name: "Category", value: this.data.category }
        ];
        this.ngxUiLoaderService.stop();
      },
      (error: any) => {
        this.ngxUiLoaderService.stop();
        if (error.error.message) {
          this.responseMessage = error.error.message;
          this.toastService.showToastMessage(new Alert(AlertType.ERROR), this.responseMessage);
        } else {
          this.toastService.showToastMessage(new Alert(AlertType.ERROR), GlobalConstants.error.toString());
        }

      }
    );
  }
}
