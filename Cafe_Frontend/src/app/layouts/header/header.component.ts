import {Component, inject} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatIconButton} from "@angular/material/button";
import {Router} from "@angular/router";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConfirmationComponent} from "../../dialog/confirmation/confirmation.component";
import {LocalStorageUtil} from "../../utils/local-storage-utils";
import {ChangePasswordComponent} from "../../dialog/change-password/change-password.component";
import {ProfileComponent} from "../../profile/profile.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatIcon,
    MatMenu,
    MatMenuTrigger,
    MatIconButton,
    MatMenuItem
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  role: any;
  router = inject(Router);
  matDialog = inject(MatDialog);

  logOut() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'Log Out',
      confirmation: true
    }
    dialogConfig.width = "490px";
    const dialogRef = this.matDialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((res) => {
      dialogRef.close();
      LocalStorageUtil.clearStorage();
      this.router.navigate(['/']);
    })
  }

  changePassword() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "550px";
    this.matDialog.open(ChangePasswordComponent, dialogConfig);

  }

  viewProfile() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "550px";
    this.matDialog.open(ProfileComponent, dialogConfig);
  }
}
