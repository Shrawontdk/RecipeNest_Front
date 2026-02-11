import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {AbstractControl, FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators} from "@angular/forms";
import {ProductService} from "../services/product.service";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {MatDialog} from "@angular/material/dialog";
import {ToastService} from "../services/ToastService";
import {Router} from "@angular/router";
import {CategoryService} from "../services/category.service";
import {BillService} from "../services/bill.service";
import {GlobalConstants} from "../shared/global-constants";
import {Alert, AlertType} from "../services/Alert";
import {J} from "@angular/cdk/keycodes";
import {saveAs} from "file-saver";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatCard} from "@angular/material/card";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {JsonPipe, NgForOf, NgIf} from "@angular/common";
import {MatOption, MatSelect} from "@angular/material/select";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef, MatTable, MatTableModule
} from "@angular/material/table";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'app-manage-order',
  standalone: true,
  imports: [
    MatButton,
    MatCard,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatError,
    NgIf,
    MatSelect,
    MatOption,
    JsonPipe,
    NgForOf,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIconButton,
    MatRow,
    MatRowDef,
    MatTable,
    MatTooltip,
    MatTableModule
  ],
  templateUrl: './manage-order.component.html',
  styleUrl: './manage-order.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ManageOrderComponent implements OnInit {
  displayedColumns: string[] = ['sn', 'name', 'category', 'price', 'quantity', 'total', 'edit'];
  dataSource: any = [];
  form: UntypedFormGroup = new UntypedFormGroup({});
  categorys: any = [];
  products: any = [];
  price: any;
  totalAmount: number = 0;
  responseMessage: any;
  productService = inject(ProductService);
  ngxUiLoaderService = inject(NgxUiLoaderService);
  matDialog = inject(MatDialog);
  toastService = inject(ToastService);
  router = inject(Router);
  categoryService = inject(CategoryService);
  billService = inject(BillService);
  formBuilder = inject(FormBuilder);


  ngOnInit() {
    this.ngxUiLoaderService.start();
    this.getCategorys();
    this.form = this.formBuilder.group({
      name: [undefined, Validators.required],
      email: [undefined, [Validators.required, Validators.pattern((GlobalConstants.emailRegex).toString())]],
      contactNumber: [undefined, [Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex.toString())]],
      paymentMethod: [undefined, Validators.required],
      product: [undefined, Validators.required],
      category: [undefined, Validators.required],
      quantity: [undefined, Validators.required],
      price: [undefined, Validators.required],
      total: [0, Validators.required],
    });
  }

  private getCategorys() {
    this.categoryService.getFilteredCategory().subscribe({
      next: (res: any) => {
        this.ngxUiLoaderService.stop();
        this.categorys = res;
      }, error: (err: any) => {
        this.ngxUiLoaderService.stop();
        if (err.error.message) {
          this.responseMessage = err.error.message;
          this.toastService.showToastMessage(new Alert(AlertType.ERROR), this.responseMessage);
        }
      }
    });
  }

  getProductsByCategory(value: any) {
    this.productService.getProductsByCategory(value.id).subscribe({
      next: (res: any) => {
        this.products = res;
        this.form.controls['price'].setValue('');
        this.form.controls['quantity'].setValue('');
        this.form.controls['total'].setValue(0);
      }, error: (err: any) => {
        this.ngxUiLoaderService.stop();
        if (err.error.message) {
          this.responseMessage = err.error.message;
          this.toastService.showToastMessage(new Alert(AlertType.ERROR), this.responseMessage);
        }
      }
    });
  }

  getProductDetails(value: any) {
    this.productService.getById(value.id).subscribe({
      next: (res: any) => {
        this.price = res;
        this.form.controls['price'].setValue(res.price);
        this.form.controls['quantity'].setValue('1');
        this.form.controls['total'].setValue(this.price.price * 1);
      }, error: (err: any) => {
        this.ngxUiLoaderService.stop();
        if (err.error.message) {
          this.responseMessage = err.error.message;
          this.toastService.showToastMessage(new Alert(AlertType.ERROR), this.responseMessage);
        }
      }
    });
  }

  setQuantity(value: any) {
    const temp = this.form.controls['quantity'].value;
    if (temp > 0) {
      this.form.controls['total'].setValue(this.form.controls['quantity'].value *
        this.form.controls['price'].value);
    } else if (temp != 0) {
      this.form.controls['quantity'].setValue('1');
      this.form.controls['total'].setValue(this.form.controls['quantity'].value *
        this.form.controls['price'].value);
    }
  }


  validateProductAdd() {
    if (this.form.controls['total'].value === 0 || this.form.controls['total'].value === null ||
      this.form.controls['total'].value <= 0) {
      return true;
    } else {
      return false;
    }
  }

  validateSubmit() {
    if (this.totalAmount === 0 || this.form.controls['name'].value === null ||
      this.form.controls['email'].value === null || this.form.controls['contactNumber'].value === null ||
      this.form.controls['paymentMethod'].value === null) {
      return true;
    } else {
      return false;
    }
  }

  add() {
    const formData = this.form.value;
    const productName = this.dataSource.find((e: { id: number }) => e.id === formData.product.id);
    if (productName === undefined) {
      this.totalAmount = this.totalAmount + formData.total;
      this.dataSource.push({
        id: formData.product.id, name: formData.product.name, category: formData.category.name,
        quantity: formData.quantity, price: formData.price, total: formData.total
      });
      this.dataSource = [...this.dataSource];
      this.toastService.showToastMessage(new Alert(AlertType.SUCCESS), "Success.")
    } else {
      this.toastService.showToastMessage(new Alert(AlertType.ERROR), GlobalConstants.error.toString());

    }
  }

  handleDelete(value: any, element: any) {
    this.totalAmount = this.totalAmount - element.total;
    this.dataSource.splice(value, 1);
    this.dataSource = [...this.dataSource];
  }

  submit() {
    const formData = this.form.value;
    const data = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      paymentMethod: formData.paymentMethod,
      totalAmount: this.totalAmount.toString(),
      productDetails: JSON.stringify(this.dataSource)
    }

    this.ngxUiLoaderService.start();
    this.billService.generateReport(data).subscribe({
      next: (res: any) => {
        this.downloadFile(res?.uuid)
        this.form.reset();
        this.dataSource = [];
        this.totalAmount = 0;
      }, error: (err: any) => {
        this.ngxUiLoaderService.stop();
        if (err.error.message) {
          this.responseMessage = err.error.message;
          this.toastService.showToastMessage(new Alert(AlertType.ERROR), this.responseMessage);
        }
      }
    })
  }

  private downloadFile(fileName: string) {
    const data = {
      uuid: fileName
    }
    this.billService.getPdf(data).subscribe({
      next: (res: any) => {
        saveAs(res, fileName + ".pdf");
        this.ngxUiLoaderService.stop();
      }, error: (err: any) => {
        this.ngxUiLoaderService.stop();
        if (err.error.message) {
          this.responseMessage = err.error.message;
          this.toastService.showToastMessage(new Alert(AlertType.ERROR), this.responseMessage);
        }
      }
    });
  }

  get FormControls(): { [key: string]: AbstractControl }{
    return this.form.controls;
  }
}
