import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ApiUtils} from "../utils/api-utils";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private static API = 'dashboard'
  http = inject(HttpClient);

  constructor() { }
  getDetails(){
    const req = ApiUtils.getRequest(`${this.getApi()}/details`)
    return this.http.get(req.url, {headers: req.header});
  }


  protected getApi(){
    return DashboardService.API;
  }
}
