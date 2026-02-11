import {Component, EventEmitter, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators} from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef
} from "@angular/material/dialog";
import {CategoryService} from "../services/category.service";
import {ToastService} from "../services/ToastService";
import {ProductService} from "../services/product.service";
import {GlobalConstants} from "../shared/global-constants";
import {Alert, AlertType} from "../services/Alert";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatToolbar, MatToolbarRow} from "@angular/material/toolbar"
import {CommonModule, NgIf} from "@angular/common";
import {MatOption, MatSelect} from "@angular/material/select";

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatError,
    MatFormField,
    MatIconButton,
    MatInput,
    MatLabel,
    MatToolbar,
    MatToolbarRow,
    NgIf,
    ReactiveFormsModule,
    MatSelect,
    MatOption,
    CommonModule
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ProductComponent implements OnInit {
  onAddProduct = new EventEmitter();
  onEditProduct = new EventEmitter();
  form: UntypedFormGroup = new UntypedFormGroup({});
  dialogAction: any = "Add";
  action: any = "Add";
  responseMessage: any;
  categorys: any = [];
  protected dialogData = inject(MAT_DIALOG_DATA);
  formBuilder = inject(FormBuilder);
  productService = inject(ProductService);
  categoryService = inject(CategoryService);
  dialogRef = inject(MatDialogRef<ProductComponent>);
  toastService = inject(ToastService);

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: [undefined, [Validators.required]],
      price: [undefined, [Validators.required]],
      categoryId: [undefined, [Validators.required]],
      description: [undefined, [Validators.required]]
    });

    if (this.dialogData.action === "Edit") {
      this.dialogAction = "Edit";
      this.action = "Update";
      this.form.patchValue(this.dialogData.data);
    }
    this.getcategorys();

  }

  private getcategorys() {
    this.categoryService.getCategory().subscribe({
      next: (res: any) => {
        this.categorys = res;
      }, error: (err: any) => {
        if (err.error.message) {
          this.responseMessage = err.error.message;
          this.toastService.showToastMessage(new Alert(AlertType.ERROR), this.responseMessage);
        }
      }
    });
  }

  submit() {
    if (this.dialogAction === "Edit") {
      this.edit();
    } else {
      this.add();
    }

  }

  private edit() {
    const formData = this.form.value;
    const data = {
      id: this.dialogData.data.id,
      name: formData.name,
      categoryId: formData.categoryId,
      price: formData.price,
      description: formData.description
    }
    this.productService.update(data).subscribe({
      next: (res: any) => {
        this.dialogRef.close();
        this.onEditProduct.emit();
        this.responseMessage = res?.message;
        this.toastService.showToastMessage(new Alert(AlertType.SUCCESS), this.responseMessage);
      }, error: (err: any) => {
        this.dialogRef.close();
        if (err.error.message) {
          this.responseMessage = err.error.message;
          this.toastService.showToastMessage(new Alert(AlertType.ERROR), this.responseMessage);
        }
      }
    });
  }

  private add() {
    const formData = this.form.value;
    const data = {
      name: formData.name,
      categoryId: formData.categoryId,
      price: formData.price,
      description: formData.description
    }
    this.productService.add(data).subscribe({
      next: (res: any) => {
        this.dialogRef.close();
        this.onAddProduct.emit();
        this.responseMessage = res?.message;
        this.toastService.showToastMessage(new Alert(AlertType.SUCCESS), this.responseMessage);
      }, error: (err: any) => {
        this.dialogRef.close();
        if (err.error.message) {
          this.responseMessage = err.error.message;
          this.toastService.showToastMessage(new Alert(AlertType.ERROR), this.responseMessage);
        }
      }
    });
  }

}
