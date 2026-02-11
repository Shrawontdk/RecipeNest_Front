import {inject, Injectable} from '@angular/core';
import {environment} from "@env/environment";
import {ApiConfig} from "../utils/api-config";
import {HttpClient} from "@angular/common/http";
import {ApiUtils} from "../utils/api-utils";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  http = inject(HttpClient);
  static API = 'user';


  constructor() {

  }

  signUp(data: any) {
    const req = ApiUtils.getRequest(`${this.getApi()}/signUp`)
    return this.http.post(req.url, data, {headers: req.header});
  }

  forgotPassword(data: any) {
    const req = ApiUtils.getRequest(`${this.getApi()}/forgotPassword`)
    return this.http.post(req.url, data, {headers: req.header});
  }

  login(data: any) {
    const req = ApiUtils.getRequest(`${this.getApi()}/login`)
    return this.http.post(req.url, data, {headers: req.header});
  }

  checkToken() {
    const req = ApiUtils.getRequest(`${this.getApi()}/checkToken`)
    return this.http.get(req.url, {headers: req.header});
  }

  changePassword(data: any) {
    const req = ApiUtils.getRequest(`${this.getApi()}/changePassword`)
    return this.http.post(req.url, data, {headers: req.header});
  }

  getUser(){
    const req = ApiUtils.getRequest(`${this.getApi()}/get`)
    return this.http.get(req.url, {headers: req.header});
  }

  update(data: any){
    const req = ApiUtils.getRequest(`${this.getApi()}/update`)
    return this.http.post(req.url, data, {headers: req.header});
  }

  uploadFile(file: File){
    const formData = new FormData();
    formData.append('file', file);
    const req = ApiUtils.getRequestWithFileSupport(`${this.getApi()}/upload`)
    return this.http.post(req.url, formData, {headers: req.header});
  }
  getProfilePictureUrl(): Observable<any> {
    const req = ApiUtils.getRequest(`${this.getApi()}/profile-picture`)
    return this.http.get(req.url, { responseType: "text" });
  }

  getUserDetails(): Observable<any> {
    const req = ApiUtils.getRequest(`${this.getApi()}/user-details`)
    return this.http.get(req.url, { headers: req.header });
  }

  protected getApi(): string {
    return UserService.API;
  }
}
