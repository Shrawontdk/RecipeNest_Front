import {inject, Injectable} from '@angular/core';
import {AuthGuardService} from "./authGuard.service";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {ToastService} from "../ToastService";
import {jwtDecode} from "jwt-decode";
import {Alert, AlertType} from "../Alert";
import {GlobalConstants} from "../../shared/global-constants";
import {LocalStorageUtil} from "../../utils/local-storage-utils";

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService {
  authService = inject(AuthGuardService);
  router = inject(Router);
  toaster = inject(ToastService)

  constructor() {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const token: any = LocalStorageUtil.getStorage().at;
    const currentUrl = state.url;
    let tokenPayload: any;
    try {
      tokenPayload = jwtDecode(token);
    } catch (error) {
      localStorage.clear()
      this.router.navigate(['/']);
    }

    if (tokenPayload.role == 'user' || tokenPayload.role == 'admin') {
      if (this.authService.isAuthenticated()) {
        return true;
      }
      this.toaster.showToastMessage(new Alert(AlertType.ERROR), GlobalConstants.unauthorized);
      this.router.navigate(['/cafe/dashboard']);
      return false;
    } else {
      this.handleAuthFailure();
      return false;
    }
  }

  private handleAuthFailure(): void {
    console.log('Authentication failed. Redirecting to home.');
    this.toaster.showToastMessage(new Alert(AlertType.ERROR), GlobalConstants.unauthorized);
    LocalStorageUtil.clearStorage();
    this.router.navigate(['/']);
  }
}
