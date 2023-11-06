import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreadCrumbService {

  breadCrumb$: Observable<any>;
    private breadCrumbSubject = new Subject<any>();

    constructor() {
        this.breadCrumb$ = this.breadCrumbSubject.asObservable();
    }

    breadCrumb(data: any) {
        console.log(data); // I have data! Let's return it so subscribers can use it!
        // we can do stuff with data if we want
        this.breadCrumbSubject.next(data);
    }
}
