import {Component, EventEmitter, inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent} from "@angular/material/dialog";
import {MatToolbar, MatToolbarModule} from "@angular/material/toolbar";
import {MatButton, MatIconButton} from "@angular/material/button";

@Component({
  selector: 'app-comfirmation',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatToolbar,
    MatIconButton,
    MatDialogClose,
    MatDialogContent,
    MatDialogActions,
    MatButton
  ],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss'
})
export class ConfirmationComponent implements OnInit {
  onEmitStatusChange =new EventEmitter();
  details: any = {};
  private dialogData = inject(MAT_DIALOG_DATA);
  ngOnInit() {
    if(this.dialogData && this.dialogData.confirmation){
      this.details = this.dialogData;
    }
  }
  handleChangeAction(){
    this.onEmitStatusChange.emit();
  }

}
