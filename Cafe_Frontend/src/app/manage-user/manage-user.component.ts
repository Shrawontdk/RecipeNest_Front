import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {ProductService} from "../services/product.service";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {MatDialog} from "@angular/material/dialog";
import {ToastService} from "../services/ToastService";
import {UserService} from "../services/user.service";
import {Alert, AlertType} from "../services/Alert";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderRow,
  MatHeaderRowDef, MatRow, MatRowDef, MatTable,
  MatTableDataSource, MatTableModule
} from "@angular/material/table";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatCard} from "@angular/material/card";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'app-manage-user',
  standalone: true,
  imports: [
    MatButton,
    MatCard,
    MatFormField,
    MatInput,
    MatLabel,
    MatTableModule,
    MatIconButton,
    MatSlideToggle,
    MatTooltip
  ],
  templateUrl: './manage-user.component.html',
  styleUrl: './manage-user.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ManageUserComponent implements OnInit {

  displayedColumns: string[] = ['sn', 'name', 'email', 'contactNumber', 'status'];
  dataSource: any;
  responseMessage: any;
  userService = inject(UserService);
  ngxUiLoaderService = inject(NgxUiLoaderService);
  toastService = inject(ToastService);
  ngOnInit() {
    this.ngxUiLoaderService.start();
    this.getUsers();
  }

  private getUsers() {
    this.userService.getUser().subscribe(
      (response: any) => {
        this.dataSource = new MatTableDataSource(response);
        this.ngxUiLoaderService.stop();
      },
      error => {
        this.ngxUiLoaderService.stop();
        if (error.error.message) {
          this.responseMessage = error.error.message;
          this.toastService.showToastMessage(new Alert(AlertType.ERROR), this.responseMessage);
        }
      }
    );
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onChange(checked: boolean, id: any) {
    this.ngxUiLoaderService.start();
    const data = {
      status: checked.toString(),
      id: id
    }
    this.userService.update(data).subscribe({
      next: (res: any) => {
        this.ngxUiLoaderService.stop();
        this.responseMessage = res?.message;
        this.toastService.showToastMessage(new Alert(AlertType.SUCCESS), this.responseMessage);
      }, error: (err: any) => {
        this.ngxUiLoaderService.stop();
        if (err.error.message) {
          this.responseMessage = err.error.message;
          this.toastService.showToastMessage(new Alert(AlertType.ERROR), this.responseMessage);
        }
      }
    });

  }
}
