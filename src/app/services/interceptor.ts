import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Injectable, Injector } from '@angular/core';
import { Observable, throwError } from "rxjs";
import { catchError, finalize, tap } from 'rxjs/operators';
import { AuthService } from "./auth.service";
import { LoaderService } from "./loadingService";

@Injectable()
export class Interceptor implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];

  constructor(private injector: Injector, private loaderService: LoaderService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authService = this.injector.get(AuthService);

    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authService.getToken()}`
      }
    });

    this.requests.push(req);
    console.log(`=-=-=-=-=interceptor`);
    this.loaderService.showLoader(); // Show loader before making the request

    return next.handle(req).pipe(
      tap(
        event => {
          if (event instanceof HttpResponse) {
            console.log('Response:', event);
          }
        },
        error => {
          if (error instanceof HttpErrorResponse) {
            console.error('Error:', error);
            if (error.status === 401) {
              // Log out the user or perform any other desired action
              authService.logout();
            }
            // Handle specific error cases if needed
          }
        }
      ),
      catchError((error: HttpErrorResponse) => {
        console.error('Request failed:', error);
        // Handle error cases globally if needed
        return throwError(error);
      }),
      finalize(() => {
        this.removeRequest(req);
        this.loaderService.hideLoader(); // Hide loader when the response is received
      })
    );
  }

  private removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
  }
}
