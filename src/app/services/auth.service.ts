import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse,
} from "@angular/common/http";
import { Observable, Subject, throwError } from "rxjs";
import { catchError, takeUntil, tap } from "rxjs/operators";
@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private http: HttpClient) { }
  /*** LOCAL BACKEND ***/
  // baseURL = "http://localhost:8000";
  /*** PRODUCTION BACKEND ***/
  // baseURL = "http://54.254.242.153:8000";

  /* UAT LINK */
  baseURL = "http://122.248.216.29:8000"


  // 1. Generic API Methods
  post(data: any, apiURL): Observable<any> {
    return this.http.post(`${this.baseURL}${apiURL}`, data);
  }
  put(data: any, apiURL): Observable<any> {
    return this.http.put(`${this.baseURL}${apiURL}`, data);
  }
  get(apiURL) {
    return this.http.get(`${this.baseURL}${apiURL}`);
  }
  
  getToken() {
    return localStorage.getItem("token") || "";
  }


  logout(): Observable<HttpResponse<any>> {
    return this.http
      .delete(this.baseURL + "/v1/security/logout", { observe: "response" })
      .pipe(
        tap((response) => {
          if (response.status === 200) {
            localStorage.removeItem("token");
            console.log(response);
          }
        })
      );
  }


  // all functions
  dahboardDetails(apiURL: string): Observable<any> {
    const url = `${this.baseURL}${apiURL.startsWith("/") ? apiURL : `/${apiURL}`
      }`;
    return this.http.get<any>(url, {});
  }

  getCurrentUser(apiURL: string): Observable<any> {
    const url = `${this.baseURL}${apiURL.startsWith("/") ? apiURL : `/${apiURL}`
      }`;
    return this.http.post<any>(url, {});
  }

  getCoporateList(skip: number, limit: number, apiURL: string) {
    const requestBody = { skip: skip, limit: limit };
    const url = `${this.baseURL}${apiURL}`;
    return this.http.post<any>(url, requestBody);
  }

  getCoporateUserList(corporateID: number, skip: number, limit: number, apiURL: string) {
    const requestBody = { corporateID: corporateID, skip: skip, limit: limit };

    const url = `${this.baseURL}${apiURL}`;
    return this.http.post<any>(url, requestBody);
  }

  getCoporateVendorList(corporateID: number, skip: number, limit: number, apiURL: string) {
    const requestBody = { corporateID: corporateID, skip: skip, limit: limit };
    const url = `${this.baseURL}${apiURL}`;
    return this.http.post<any>(url, requestBody);
  }

  listOrdersOfVendors(vendorID: number, corporateID: number, skip: number, limit: number, apiURL: string) {
    const requestBody = { vendorID: vendorID, corporateID: corporateID, skip: skip, limit: limit };
    const url = `${this.baseURL}${apiURL}`;
    return this.http.post<any>(url, requestBody);
  }

  listOrderInvoiceOfVendors(corporateID: number, orderID: number, skip: number, limit: number, apiURL: string) {
    const requestBody = { corporateID: corporateID, orderID: orderID, skip: skip, limit: limit };
    const url = `${this.baseURL}${apiURL}`;
    return this.http.post<any>(url, requestBody);
  }
  viewDocumentInvoice(invoiceID: string, ext: string, apiURL: string) {
    const requestBody = { invoiceID: invoiceID, ext: ext };
    const url = `${this.baseURL}${apiURL}`;
    return this.http.post<any>(url, requestBody);

  }
  getVendorList(skip: number, limit: number, apiURL: string) {
    const requestBody = { skip: skip, limit: limit };
    const url = `${this.baseURL}${apiURL}`;
    return this.http.post<any>(url, requestBody);
  }

  getCoporateVendorLists(skip: number, limit: number, apiURL: string) {
    const requestBody = { skip: skip, limit: limit };
    const url = `${this.baseURL}${apiURL}`;
    return this.http.post<any>(url, requestBody);
  }

  linkVendor(vendorID: number, apiURL: string) {
    const requestBody = { vendorID: vendorID };
    const url = `${this.baseURL}${apiURL}`;
    return this.http.post<any>(url, requestBody);
  }
  getCoporateOrderLists(corporateID: number, skip: number, limit: number, apiURL: string) {
    const requestBody = { corporateID: corporateID, skip: skip, limit: limit };
    const url = `${this.baseURL}${apiURL}`;
    return this.http.post<any>(url, requestBody);
  }
  getOrder(orderID: number, skip: number, limit: number, apiURL: string) {
    const requestBody = { orderID: orderID, skip: skip, limit: limit };
    const url = `${this.baseURL}${apiURL}`;
    return this.http.post<any>(url, requestBody);
  }
  getCoporateUserGroups(corporateID: number, apiURL: string) {
    const requestBody = { corporateID: corporateID };
    const url = `${this.baseURL}${apiURL}`;
    return this.http.post<any>(url, requestBody);
  }
  getUserDetail(userID: number, apiURL: string) {
    const requestBody = { userID: userID };
    const url = `${this.baseURL}${apiURL}`;
    return this.http.post<any>(url, requestBody);
  }

  getL1UserOrderLists(skip: number, limit: number, apiURL: string) {
    const requestBody = { skip: skip, limit: limit };
    const url = `${this.baseURL}${apiURL}`;
    return this.http.post<any>(url, requestBody);
  }
  Approve(invoiceID: number, apiURL: string) {
    const requestBody = { invoiceID: invoiceID };
    const url = `${this.baseURL}${apiURL}`;
    return this.http.post<any>(url, requestBody);

  }

  bulkApprove(orderID: number, apiURL: string) {
    const requestBody = { orderID: orderID };
    const url = `${this.baseURL}${apiURL}`;
    return this.http.post<any>(url, requestBody);

  }
  getCoporate(corporateID:number,apiURL: string){
    const requestBody = { corporateID: corporateID };
    const url = `${this.baseURL}${apiURL}`;
    return this.http.post<any>(url, requestBody);
  }
}