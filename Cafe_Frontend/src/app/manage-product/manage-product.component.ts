import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {ProductService} from "../services/product.service";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ToastService} from "../services/ToastService";
import {Router} from "@angular/router";
import {Alert, AlertType} from "../services/Alert";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderRow,
  MatRow,
  MatTable,
  MatTableDataSource,
  MatTableModule
} from "@angular/material/table";
import {MatCard} from "@angular/material/card";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatTooltip} from "@angular/material/tooltip";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {NgForOf} from "@angular/common";
import {ProductComponent} from "../product/product.component";
import {ConfirmationComponent} from "../dialog/confirmation/confirmation.component";
import {CategoryService} from "../services/category.service";

@Component({
  selector: 'app-manage-product',
  standalone: true,
  imports: [
    MatLabel,
    MatCard,
    MatButton,
    MatFormField,
    MatInput,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatIconButton,
    MatTooltip,
    MatHeaderRow,
    MatRow,
    MatTableModule,
    MatSlideToggle,
    NgForOf,
  ],
  templateUrl: './manage-product.component.html',
  styleUrl: './manage-product.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ManageProductComponent implements OnInit {
  displayColumns: string[] = ['sn', 'name', 'category', 'description', 'price', 'edit'];
  dataSource: any;
  length1: any;
  responseMessage: any;
  productService = inject(ProductService);
  ngxUiLoaderService = inject(NgxUiLoaderService);
  matDialog = inject(MatDialog);
  toastService = inject(ToastService);
  router = inject(Router);


  ngOnInit() {
    this.ngxUiLoaderService.start();
    this.tableData();
  }

  tableData() {
    this.productService.getProducts().subscribe({
      next: (response: any) => {
        this.dataSource = new MatTableDataSource(response);
        this.ngxUiLoaderService.stop();
      },
      error: (error: any) => {
        this.ngxUiLoaderService.stop();
        if (error.error.message) {
          this.responseMessage = error.error.message;
          this.toastService.showToastMessage(new Alert(AlertType.ERROR), this.responseMessage);
        }
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Add'
    };
    dialogConfig.width = "850px";
    const dialogRef = this.matDialog.open(ProductComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    dialogRef.componentInstance.onAddProduct.subscribe((res) => {
      this.tableData();
    });
  }

  handleEditAction(element: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data: element
    };
    dialogConfig.width = "850px";
    const dialogRef = this.matDialog.open(ProductComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    dialogRef.componentInstance.onEditProduct.subscribe((res) => {
      this.tableData();
    });
  }

  deleteProduct(value: any) {
    const val = value;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'Delete ' + val.name + 'product',
      confirmation: true,
    };
    dialogConfig.width = "850px";
    const dialogRef = this.matDialog.open(ConfirmationComponent, dialogConfig);
    dialogRef.componentInstance.onEmitStatusChange.subscribe(() => {
      this.ngxUiLoaderService.start();
      this.productService.delete(val.id).subscribe({
        next: (res: any) => {
          this.ngxUiLoaderService.stop();
          dialogRef.close();
          this.tableData();
          this.responseMessage = res?.message;
          this.toastService.showToastMessage(new Alert(AlertType.SUCCESS), this.responseMessage);
        }, error: (err: any) => {
          this.ngxUiLoaderService.stop();
          dialogRef.close();
          if (err.error.message) {
            this.responseMessage = err.error.message;
            this.toastService.showToastMessage(new Alert(AlertType.ERROR), this.responseMessage);
          }
        }
      });
    });
  }

  onChange(checked: boolean, id: any) {
    this.ngxUiLoaderService.start();
    const data = {
      status: checked.toString(),
      id: id
    }
    this.productService.updateStatus(data).subscribe({
      next: (res: any) => {
        this.ngxUiLoaderService.stop();
        this.responseMessage = res?.message;
        this.toastService.showToastMessage(new Alert(AlertType.SUCCESS), this.responseMessage);
      }, error: (err: any) => {
        this.ngxUiLoaderService.stop();
        if (err.error.message) {
          this.responseMessage = err.error.message;
          this.toastService.showToastMessage(new Alert(AlertType.ERROR), this.responseMessage);
        }
      }
    });

  }
}

