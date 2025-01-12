import { BehaviorSubject, Observable, Subject, switchMap, take, tap } from 'rxjs';

export class Reloader {
  private shouldReload$ = new BehaviorSubject<void>(undefined);
  private reloadDone$ = new Subject<void>();

  /**
   * Makes given observable callback reloadable using the reload() method below.
   * @param callback
   */
  reloadable<T>(callback: () => Observable<T>): Observable<T> {
    return this.shouldReload$.pipe(
      switchMap(() => callback()),
      tap(() => this.reloadDone$.next()),
    );
  }

  /**
   * Reloads all reloadable-s in this class instance and finishes when first of those reloadable-s finish.
   */
  reload() {
    this.shouldReload$.next();

    return this.reloadDone$.pipe(take(1));
  }
}
