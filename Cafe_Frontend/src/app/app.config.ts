import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import {provideRouter, RouterModule} from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {HttpClientModule, provideHttpClient, withInterceptors} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NbLayoutModule, NbOverlayModule, NbThemeModule, NbToastrModule} from '@nebular/theme';
import {ToastrModule} from "ngx-toastr";
import {tokenInterceptorInterceptor} from "./services/authenitication/token-interceptor.interceptor";
import {MenuItems} from "./shared/menu-items";

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      RouterModule.forRoot(routes, { useHash: true }),
      HttpClientModule,
      BrowserAnimationsModule,
      ToastrModule.forRoot({  preventDuplicates: true}),
    ),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withInterceptors([tokenInterceptorInterceptor])),
    MenuItems
  ]
};
