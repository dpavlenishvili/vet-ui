import type { HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';

export type HttpRequestOptions = {
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      };
  observe?: 'body';
  params?:
    | HttpParams
    | {
        [param: string]: string | string[];
      };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
  context?: HttpContext;
};
