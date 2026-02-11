import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators} from "@angular/forms";
import {UserService} from "../services/user.service";
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {ToastService} from "../services/ToastService";
import {GlobalConstants} from "../shared/global-constants";
import {Alert, AlertType} from "../services/Alert";
import {MatToolbar, MatToolbarRow} from "@angular/material/toolbar";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatError, MatFormField, MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {NgIf} from "@angular/common";
import {MatInputModule} from "@angular/material/input";

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    MatToolbar,
    MatToolbarRow,
    MatIconButton,
    MatDialogClose,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    NgIf,
    MatDialogActions,
    MatButton,
    MatError,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent implements OnInit {
  form: UntypedFormGroup = new UntypedFormGroup({});
  responseMessage: any;
  formBuilder = inject(FormBuilder);
  userService = inject(UserService);
  dialogRef = inject(MatDialogRef<ForgotPasswordComponent>);
  ngxService = inject(NgxUiLoaderService);
  toaster = inject(ToastService);

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(GlobalConstants.emailRegex.toString())]]
    });
  }

  submit() {
    this.ngxService.start();
    const formData = this.form.value;
    const data = {
      email: formData.email
    }
    this.userService.forgotPassword(data).subscribe({
      next: (res: any) => {
        this.ngxService.stop();
        this.dialogRef.close();
        this.responseMessage = res?.message;
        this.toaster.showToastMessage(new Alert(AlertType.SUCCESS), this.responseMessage);
      }, error: (err: any) => {
        this.ngxService.stop();
        if (err.error?.message) {

          this.toaster.showToastMessage(new Alert(AlertType.ERROR), err.error.message);
        }
      }
    })
  }

}
