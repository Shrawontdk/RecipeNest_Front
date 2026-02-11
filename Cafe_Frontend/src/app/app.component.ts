import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NgxUiLoaderModule} from "ngx-ui-loader";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {NbLayoutModule} from "@nebular/theme";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgxUiLoaderModule, HttpClientModule, NbLayoutModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Cafe_Frontend';
}
