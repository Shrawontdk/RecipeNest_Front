import {inject, Injectable, PLATFORM_ID} from '@angular/core';
import {Router} from "@angular/router";
import {LocalStorageUtil} from "../../utils/local-storage-utils";
import {jwtDecode} from "jwt-decode";
import {ToastService} from "../ToastService";
import {Alert, AlertType} from "../Alert";
import {isPlatformBrowser} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  router = inject(Router);
  toastMessage = inject(ToastService);
  private platformId = inject(PLATFORM_ID);

  constructor() {
  }

  isAuthenticated() {
    if (!isPlatformBrowser(this.platformId)) {
      return true;
    }
    const token = LocalStorageUtil.getStorage().at;
    if (!token) {
      this.router.navigate(['/']);
      return false;
    }
    try {
      const decodedToken: any = jwtDecode(token);
      const isTokenExpired =
        decodedToken?.exp && decodedToken.exp < Date.now() / 1000;

      if (isTokenExpired) {
        this.toastMessage.showToastMessage(
          new Alert(AlertType.ERROR),
          'Token expired.'
        );
        LocalStorageUtil.clearStorage();
        this.router.navigate(['/']);
        return false;
      }

      return true;
    } catch (e) {
      // Invalid token format
      LocalStorageUtil.clearStorage();
      this.router.navigate(['/']);
      return false;
    }
  }

}
