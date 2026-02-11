import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {ToastService} from "../services/ToastService";
import {GlobalConstants} from "../shared/global-constants";
import {Alert, AlertType} from "../services/Alert";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatToolbar, MatToolbarRow} from "@angular/material/toolbar";
import {NgIf} from "@angular/common";
import {MatTooltip} from "@angular/material/tooltip";
import {LocalStorage, LocalStorageUtil} from "../utils/local-storage-utils";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
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
    MatSuffix,
    MatTooltip
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  hide: boolean = true;
  loginForm: UntypedFormGroup = new UntypedFormGroup({});
  responseMessage: any;
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  userService = inject(UserService);
  dialogRef = inject(MatDialogRef<LoginComponent>);
  ngxService = inject(NgxUiLoaderService);
  toaster = inject(ToastService);

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(GlobalConstants.emailRegex.toString())]],
      password: ['', Validators.required]
    });
  }

  submit() {
    this.ngxService.start();
    const formData = this.loginForm.value;
    const data = {
      email: formData.email,
      password: formData.password
    }
    this.userService.login(data).subscribe({
      next: (res: any) => {
        this.ngxService.stop();
        this.dialogRef.close();
        const storage = LocalStorageUtil.getStorage();
        storage.at = res.token;
        LocalStorageUtil.setStorage(storage);
        this.responseMessage = res?.message;
       this.router.navigate(['/cafe/dashboard']);
      },
      error: (error: any) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.toaster.showToastMessage(new Alert(AlertType.ERROR), error.error.message);
        }
      }
    });
  }

}
