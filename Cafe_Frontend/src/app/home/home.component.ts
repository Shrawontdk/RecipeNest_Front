import {Component, inject, OnInit} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {BestSellerComponent} from "../best-seller/best-seller.component";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {SignUpComponent} from "../sign-up/sign-up.component";
import {NgModel} from "@angular/forms";
import {ForgotPasswordComponent} from "../forgot-password/forgot-password.component";
import {LoginComponent} from "../login/login.component";
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";
import {Alert, AlertType} from "../services/Alert";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatIcon,
    BestSellerComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  dialog = inject(MatDialog);
  userSrevice = inject(UserService)
  router = inject(Router);

  ngOnInit() {
    this.userSrevice.checkToken().subscribe({
      next: (res: any) => {
        this.router.navigate(['/cafe/dashboard'])
      }, error: (err: any) => {
        console.log('error:', err)
      }
    })
  }

  handleSignupAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "650px";
    this.dialog.open(SignUpComponent, dialogConfig);
  }

  handleForgotAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "650px";
    this.dialog.open(ForgotPasswordComponent, dialogConfig);
  }

  handleLogin() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "650px";
    this.dialog.open(LoginComponent, dialogConfig);
  }
}
