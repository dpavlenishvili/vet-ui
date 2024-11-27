import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export function addBaseUrl(baseUrl: string) {
  return (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    if (req.url.includes('://')) {
      return next(req);
    }

    const path = req.url.startsWith('/') ? req.url : `/${req.url}`;

    req = req.clone({
      url: req.url ? `${baseUrl}${path}` : '',
    });

    return next(req);
  };
}
