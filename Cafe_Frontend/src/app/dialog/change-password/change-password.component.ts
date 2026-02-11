import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {ToastService} from "../../services/ToastService";
import {Alert, AlertType} from "../../services/Alert";
import {MatToolbar, MatToolbarModule} from "@angular/material/toolbar";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatError, MatFormField, MatHint, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    MatToolbar,
    MatToolbarModule,
    MatHint,
    MatIconButton,
    MatDialogClose,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatSuffix,
    MatError,
    NgIf,
    MatDialogActions,
    MatButton
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit {
  oldPassword: boolean = true;
  newPassword: boolean = true;
  confirmPassword: boolean = true;
  form: UntypedFormGroup = new UntypedFormGroup({});
  responseMessage: any;
  formBuilder = inject(FormBuilder);
  userService = inject(UserService);
  ngxUiLoaderService = inject(NgxUiLoaderService);
  toastService = inject(ToastService);
  dialogRef = inject(MatDialogRef<ChangePasswordComponent>);

  ngOnInit() {
    this.form = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  validateSubmit() {
    if (this.form.controls['newPassword']?.value !== this.form.controls['confirmPassword']?.value) {
      return true;
    } else {
      return false;
    }
  }

  changePassword() {
    this.ngxUiLoaderService.start();
    const formData = this.form.value;
    const data = {
      oldPassword: formData.oldPassword,
      newPassword: formData.confirmPassword
    };
    this.userService.changePassword(data)
      .subscribe({
        next: (res: any) => {
          this.ngxUiLoaderService.stop();
          this.responseMessage = res?.message;
          this.dialogRef.close();
          this.toastService.showToastMessage(new Alert(AlertType.SUCCESS), this.responseMessage);
        }, error: (err: any) => {
          this.ngxUiLoaderService.stop();
          if (err.error.message) {
            this.responseMessage = err.error.message
            this.toastService.showToastMessage(new Alert(AlertType.ERROR), this.responseMessage);
          }
        }
      });
  }
}
