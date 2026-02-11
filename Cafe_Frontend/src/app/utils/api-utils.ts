import {HttpHeaders} from '@angular/common/http';

import {ApiConfig} from './api-config';
import {LocalStorageUtil} from "./local-storage-utils";

const MAP_API_KEY = 'AIzaSyDNCcbsbsitH8XhS8yrjlsXr0FjkGuNWUY';

export class ApiUtils {

  public static getRequest(api: string) {
    const fullApi = `${ApiConfig.URL}/${api}`;
    return {
      url: fullApi,
      header: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  public static getRequestWithFileSupport(api: string) {
    const fullApi = `${ApiConfig.URL}/${api}`;
    const at = LocalStorageUtil.getStorage();
    return {
      url: fullApi,
      header: new HttpHeaders({
        'Authorization': 'Bearer ' + at,
        'enctype': 'multipart/form-data'
      })
    };
  }

  public static getRequestForLocations(api: string) {
    const fullApi = `${api}`;
    return {
      url: fullApi,
      header: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': MAP_API_KEY
      })
    };
  }

  public static getRequestForLocationLatLng(api: string) {
    const fullApi = `${api}`;
    return {
      url: fullApi,
      header: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Goog-FieldMask': 'location',
        'X-Goog-Api-Key': MAP_API_KEY
      })
    };
  }
}

export { ApiConfig };
