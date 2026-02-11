import {Component, inject, OnInit} from '@angular/core';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule} from "@angular/material/dialog";
import {MatButton, MatButtonModule, MatIconButton} from "@angular/material/button";
import {MatToolbar, MatToolbarModule, MatToolbarRow} from "@angular/material/toolbar";
import {MatError, MatFormField, MatHint, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {UserService} from "../services/user.service";
import {Toast} from "ngx-toastr";
import {ToastService} from "../services/ToastService";
import {Alert, AlertType} from "../services/Alert";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {response} from "express";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatDialogClose,
    MatIconButton,
    MatToolbar,
    MatToolbarRow,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatError,
    MatFormField,
    MatHint,
    MatInput,
    MatLabel,
    MatSuffix,
    NgIf,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule


  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  selectedFileName: string = '';
  // uploadedFileUrl: SafeUrl = '';
  uploadedFileUrl: any;
  userService = inject(UserService);
  toastService = inject(ToastService);
  sanitizer = inject(DomSanitizer);
  userName: any;
  email: any;
  contact: any;
  status: any;

  ngOnInit() {
    this.loadProfilePicture();
    this.getUserDetails();
  }

  onFileSelected(event: Event) {
    const input = (event.target as HTMLInputElement);
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file) {
        this.selectedFileName = file.name;
        this.uploadFile(file);
      }
    }
  }

  uploadFile(file: File): void {
    this.userService.uploadFile(file).subscribe(
      response => {
        this.toastService.showToastMessage(new Alert(AlertType.SUCCESS), "Uploaded file successfully");
        this.loadProfilePicture();
      },
      error => {
        console.error('Error uploading file', error);
        if (error.status === 0) {
          return this.toastService.showToastMessage(new Alert(AlertType.ERROR), "Image is very high in dimensions and quality. System could not store it.");
        }
        if (error.error) {
          this.toastService.showToastMessage(new Alert(AlertType.ERROR), error.message);
        }

      }
    );
  }


  loadProfilePicture(): void {
    this.userService.getProfilePictureUrl().subscribe(
      (response: any) => {
        if (response && typeof response === 'string') {
          this.uploadedFileUrl = (response);
        } else {
          console.error('Invalid response:', response);
        }
      },
      error => {
        console.error('Error loading profile picture', error);
      }
    );
  }

  private getUserDetails() {
    this.userService.getUserDetails().subscribe(
      (response: any) => {
        this.patchUser(response);
      },
      error => {
        console.error('Error loading user details', error);
        if(error.error) {
          this.toastService.showToastMessage(new Alert(AlertType.ERROR), error.error);
        }
      }
    );
  }

  private patchUser(response: any) {
    this.userName = response.name;
    this.email = response.email;
    this.contact = response.contactNumber;
    this.status = response.status;
  }

  protected readonly name = name;
}
