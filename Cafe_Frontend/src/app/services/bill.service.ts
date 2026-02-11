import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ApiUtils} from "../utils/api-utils";

@Injectable({
  providedIn: 'root'
})
export class BillService {
  static URL = "bill"
  httpClient = inject(HttpClient);

  generateReport(data: any){
    const req = ApiUtils.getRequest(`${this.API()}/generateReport`);
    return this.httpClient.post(req.url ,data, {headers: req.header})
  }

  getPdf(data: any){
    const req = ApiUtils.getRequest(`${this.API()}/getPdf`);
    return this.httpClient.post(req.url ,data, {headers: req.header, responseType: "blob"})
  }
  getBills(){
    const req = ApiUtils.getRequest(`${this.API()}/getBills`);
    return this.httpClient.get(req.url , {headers: req.header})
  }

  delete(id: number){
    const req = ApiUtils.getRequest(`${this.API()}/delete/${id}`);
    return this.httpClient.post(req.url , {headers: req.header})
  }


  protected API(){
    return BillService.URL;
  }
}
