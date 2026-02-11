import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {ProductService} from "../services/product.service";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ToastService} from "../services/ToastService";
import {Router} from "@angular/router";
import {CategoryService} from "../services/category.service";
import {BillService} from "../services/bill.service";
import {FormBuilder} from "@angular/forms";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderRow,
  MatHeaderRowDef, MatRow, MatRowDef, MatTable,
  MatTableDataSource, MatTableModule
} from "@angular/material/table";
import {Alert, AlertType} from "../services/Alert";
import {ViewBillProductComponent} from "../view-bill-product/view-bill-product.component";
import {MatCard} from "@angular/material/card";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatIconButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {ConfirmationComponent} from "../dialog/confirmation/confirmation.component";
import {saveAs} from "file-saver";

@Component({
  selector: 'app-view-bill',
  standalone: true,
  imports: [
    MatCard,
    MatFormField,
    MatInput,
    MatLabel,
    MatTableModule,
    MatTooltip,
    MatSlideToggle,
    MatIconButton,

  ],
  templateUrl: './view-bill.component.html',
  styleUrl: './view-bill.component.scss',
  encapsulation: ViewEncapsulation.None

})
export class ViewBillComponent implements OnInit {
  displayedColumns: string[] = ['sn', 'name', 'email', 'contactNumber', 'paymentMethod', 'total', 'view'];
  dataSource = new MatTableDataSource<any>([]);
  responseMessage: any;
  billService = inject(BillService);
  ngxUiLoaderService = inject(NgxUiLoaderService);
  matDialog = inject(MatDialog);
  toastService = inject(ToastService);
  router = inject(Router);

  ngOnInit() {
    this.ngxUiLoaderService.start();
    this.getBillData();
  }

  private getBillData() {
    this.billService.getBills().subscribe({
      next: (res: any) => {
        this.ngxUiLoaderService.stop();
        this.dataSource = new MatTableDataSource(res);

      }, error: (err: any) => {
        this.ngxUiLoaderService.stop();
        if (err.error.message) {
          this.toastService.showToastMessage(new Alert(AlertType.ERROR), err.error.message)
        }
      }
    });
  }

  applyFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleViewAction(value: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      data: value
    };
    dialogConfig.width = "700px";
    const dialogRef = this.matDialog.open(ViewBillProductComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    })
  }

  handleDeleteAction(value: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: `delete ${value.name} bill `,
      confirmation: true
    };
    dialogConfig.width = "490px";
    const dialogRef = this.matDialog.open(ConfirmationComponent, dialogConfig);
    dialogRef.componentInstance.onEmitStatusChange.subscribe(() => {
      this.ngxUiLoaderService.start();
      this.billService.delete(value.id).subscribe({
        next: (res: any) => {
          this.ngxUiLoaderService.stop();
          this.responseMessage = res?.message;
          this.toastService.showToastMessage(new Alert(AlertType.SUCCESS), this.responseMessage);
          this.getBillData();
        }, error: (err: any) => {
          this.ngxUiLoaderService.stop();
          if (err.error.message) {
            this.toastService.showToastMessage(new Alert(AlertType.ERROR), err.error.message)
          }
        }
      });

      dialogRef.close();
    });
  }

  downloadReportAction(values: any) {
    this.ngxUiLoaderService.start();
    const data = {
      name: values?.name,
      email: values?.email,
      uuid: values?.uuid,
      contactNumber: values?.contactNumber,
      paymentMethod: values?.paymentMethod,
      totalAmount: values?.totalAmount.toString(),
      productDetails: values?.productDetails
    }
    this.downloadFile(values?.uuid, data);
  }

  downloadFile(fileName: string, data: any) {
    this.billService.getPdf(data).subscribe((res: any) => {
      saveAs(res, fileName + ".pdf");
      this.ngxUiLoaderService.stop();
    })
  }
}
