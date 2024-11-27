import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReloadService {
  private reloadSubjects: Map<string, BehaviorSubject<void>> = new Map();
  private sharedObservables: Map<string, Observable<unknown>> = new Map();

  get<T>(key: string, loadFresh: () => Observable<T>): Observable<T> {
    if (!this.sharedObservables.has(key)) {
      const reloadSubject = new BehaviorSubject<void>(undefined);
      const institution$ = reloadSubject.pipe(
        switchMap(() => loadFresh()),
        shareReplay()
      );
      this.reloadSubjects.set(key, reloadSubject);
      this.sharedObservables.set(key, institution$);
    }

    return this.sharedObservables.get(key) as Observable<T>;
  }

  reload(key: string) {
    if (this.reloadSubjects.has(key)) {
      this.reloadSubjects.get(key)!.next();
    }
  }
}
