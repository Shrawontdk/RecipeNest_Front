import { HttpInterceptorFn } from '@angular/common/http';
import {LocalStorageUtil} from "../../utils/local-storage-utils";
import {ObjectUtil} from "../../utils/ObjectUtil";
import {catchError, throwError} from "rxjs";
import {jwtDecode} from "jwt-decode";
import {Alert, AlertType} from "../Alert";
import {inject} from "@angular/core";
import {Router} from "@angular/router";
import {ToastService} from "../ToastService";
import {NgxUiLoaderService} from "ngx-ui-loader";

export const tokenInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router)
  const toastMessage = inject(ToastService)
  const ngxUiLoaderService = inject(NgxUiLoaderService)
  const attachTokenIntoRequestHeader = ObjectUtil.isEmpty(LocalStorageUtil.getStorage().at) ? req : req.clone({
    headers: req.headers.set(
      'Authorization',
      'Bearer ' + LocalStorageUtil.getStorage().at
    )
  })

  return next(attachTokenIntoRequestHeader).pipe(
    catchError((error) => {
      ngxUiLoaderService.stop();
      if([401,403].includes(error.status)) {
        const token = LocalStorageUtil.getStorage().at;
        if (token) {
          const decodedTokem = jwtDecode(token);
          const isTokenExpired = decodedTokem && decodedTokem.exp ? decodedTokem.exp < Date.now() / 1000 :  false;
          if(isTokenExpired) {
            if (error && error.error) {
              toastMessage.showToastMessage(new Alert(AlertType.ERROR), "Unauthorized");
            }
            LocalStorageUtil.clearStorage();
            router.navigate(['/']);
            return throwError(() => error);

          } else {
            if (error.status === 401 && error.error.body.message.toLowerCase() == 'user is inactive.') {
              toastMessage.showToastMessage(new Alert(AlertType.ERROR), error.error.body.message);
              LocalStorageUtil.clearStorage();
              router.navigate(['/']);
            }
            console.log('token not expired')
            return throwError(() => error);
          }
        }
        return throwError(() => error);
      } else {
        const e = error.error.message;
        if (e) {
          toastMessage.showToastMessage(new Alert(AlertType.ERROR), e);
        }
        return throwError(() => error);
      }
    }),
  );
};
