import {Component, EventEmitter, inject, OnInit} from '@angular/core';
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
import {Alert, AlertType} from "../services/Alert";
import {MatToolbar, MatToolbarModule} from "@angular/material/toolbar";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    MatToolbar,
    MatDialogClose,
    MatIconButton,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatDialogActions,
    MatButton,
    MatError,
    MatLabel,
    MatToolbarModule,
    CommonModule
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit {
  onAddCategory = new EventEmitter();
  onEditCategory = new EventEmitter();
  form: UntypedFormGroup = new UntypedFormGroup({});
  dialogAction: any = "Add";
  action: any = "Add";
  responseMessage: any;
  protected dialogData = inject(MAT_DIALOG_DATA);
  formBuilder = inject(FormBuilder);
  categoryService = inject(CategoryService);
  dialogRef = inject(MatDialogRef<CategoryComponent>);
  toastService = inject(ToastService);

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: [undefined, Validators.required]
    });
    if (this.dialogData.action === "Edit") {
      this.dialogAction = "Edit";
      this.action = "Update";
      this.form.patchValue(this.dialogData.data);
    }
  }

  handleSubmit() {
    if (this.dialogAction === "Edit") {
      this.edit();
    } else {
      this.add();
    }
  }

  add() {
    const formData = this.form.value;
    const data = {
      name: formData.name
    }
    this.categoryService.add(data).subscribe({
      next: (res: any) => {
        this.dialogRef.close();
        this.onAddCategory.emit();
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

  edit() {
    const formData = this.form.value;
    const data = {
      id: this.dialogData.data.id,
      name: formData.name
    }
    this.categoryService.update(data).subscribe({
      next: (res: any) => {
        this.dialogRef.close();
        this.onEditCategory.emit();
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
