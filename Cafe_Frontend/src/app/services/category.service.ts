import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ApiUtils} from "../utils/api-utils";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  static URL = "category"
  httpClient = inject(HttpClient);

  add(data: any) {
    const req = ApiUtils.getRequest(`${this.getApi()}/add`)
    return this.httpClient.post(req.url, data, {headers: req.header})
  }
  update(data: any) {
    const req = ApiUtils.getRequest(`${this.getApi()}/update`)
    return this.httpClient.post(req.url, data, {headers: req.header})
  }
  getCategory() {
    const req = ApiUtils.getRequest(`${this.getApi()}/get`)
    return this.httpClient.get(req.url, {headers: req.header})
  }
  deleteCategory(id: number){
    const req = ApiUtils.getRequest(`${this.getApi()}/delete/${id}`)
    return this.httpClient.post(req.url, {headers: req.header})
  }
  getFilteredCategory(){
    const req = ApiUtils.getRequest(`${this.getApi()}/get?filterValue=true`)
    return this.httpClient.get(req.url, {headers: req.header})
  }

  protected getApi() {
    return CategoryService.URL;
  }
}
