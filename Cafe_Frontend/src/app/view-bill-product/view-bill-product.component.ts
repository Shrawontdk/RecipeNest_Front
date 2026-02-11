import {Component, inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogClose, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder} from "@angular/forms";
import {ProductService} from "../services/product.service";
import {CategoryService} from "../services/category.service";
import {ToastService} from "../services/ToastService";
import {MatToolbar, MatToolbarRow} from "@angular/material/toolbar";
import {MatIconButton} from "@angular/material/button";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable, MatTableModule
} from "@angular/material/table";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'app-view-bill-product',
  standalone: true,
  imports: [
    MatToolbar,
    MatToolbarRow,
    MatDialogClose,
    MatIconButton,
    MatDialogContent,
    MatTableModule,
    MatSlideToggle,
    MatTooltip
  ],
  templateUrl: './view-bill-product.component.html',
  styleUrl: './view-bill-product.component.scss'
})
export class ViewBillProductComponent implements OnInit {
  displayedColumns: string[] = ['sn', 'name', 'category', 'price', 'quantity', 'total'];
  dataSource: any ;
  data: any;
  protected dialogData = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<ViewBillProductComponent>);
  ngOnInit() {
    this.data = this.dialogData.data;
    this.dataSource = JSON.parse(this.data.productDetails);

  }

}
