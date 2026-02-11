import {Component, inject, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  UntypedFormGroup,
  Validators
} from "@angular/forms";
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {GlobalConstants} from "../shared/global-constants";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {MatToolbar, MatToolbarModule} from "@angular/material/toolbar";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatCommonModule} from "@angular/material/core";
import {MatError, MatFormField, MatHint, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {NgClass, NgIf} from "@angular/common";
import {MatTooltip} from "@angular/material/tooltip";
import {NgxSpinner, NgxSpinnerService} from "ngx-spinner";
import {Alert, AlertType} from "../services/Alert";
import {ToastService} from "../services/ToastService";

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    MatToolbar,
    MatIcon,
    MatIconButton,
    MatDialogClose,
    MatToolbarModule,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    NgIf,
    MatError,
    MatSuffix,
    NgClass,
    MatTooltip,
    MatHint,
    MatDialogActions,
    MatButton,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent implements OnInit {
  password: boolean = true;
  confirmPassword: boolean = true;
  signUpForm: UntypedFormGroup = new UntypedFormGroup({});
  responseMessage: any;
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  userService = inject(UserService);
  dialogRef = inject(MatDialogRef<SignUpComponent>);
  ngxService = inject(NgxUiLoaderService);
  toastService = inject(ToastService);

  ngOnInit() {
    this.signUpForm = this.formBuilder.group({
      name: [undefined, [Validators.required, Validators.pattern((GlobalConstants.nameRegex).toString())]],
      email: [undefined, [Validators.required, Validators.pattern((GlobalConstants.emailRegex).toString())]],
      contactNumber: [undefined, [Validators.required, Validators.pattern((GlobalConstants.contactNumberRegex).toString())]],
      password: [undefined, [Validators.required]],
      confirmPassword: [undefined, Validators.required]
    });
  }

  validateSubmit() {
    if (this.signUpForm.controls['password'].value != this.signUpForm.controls['confirmPassword'].value) {
      return true;
    } else {
      return false;
    }
  }

  handleSubmit() {
    this.ngxService.start();
    const formData = this.signUpForm.value;
    const data = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      password: formData.password

    }
    this.userService.signUp(data).subscribe({
      next: (res: any) => {
        this.ngxService.stop();
        this.dialogRef.close();
        this.responseMessage = res?.message;
        this.toastService.showToastMessage(new Alert(AlertType.SUCCESS), this.responseMessage);
        this.router.navigate(['/']);
      }, error: (err: any) => {
        this.ngxService.stop();
        if (err.error?.message) {
          this.responseMessage = err.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericErrorMessage;
        }
        this.toastService.showToastMessage(new Alert(AlertType.ERROR), this.responseMessage);

      }
    })

  }
  get signUpFormControls(): { [key: string]: AbstractControl }{
    return this.signUpForm.controls;
  }
}
