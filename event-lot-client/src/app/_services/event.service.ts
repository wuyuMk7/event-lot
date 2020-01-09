import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { BasicEvent, Event, formDataToEvent } from '../_models/event';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  userEventCollection: AngularFirestoreCollection<BasicEvent>;
  userEventList$: Observable<Event[]>;

  constructor(
    private _authService: AuthService,
    private _db: AngularFirestore) {

    this._authService.user().subscribe((user) => {
      this.userEventCollection = this._db.collection<BasicEvent>(`records/${user.uid}/events`);
      this.userEventList$ = this.userEventCollection.snapshotChanges().pipe(
        map(events => events.map(event => {
          const data = event.payload.doc.data() as BasicEvent;
          const id = event.payload.doc.id;
          return { id, ...data };
        }))
      )
    });
  }

  getEvent(eventId: string, group: string): Observable<any>{
    return this._authService.user().pipe(
      map((user: any)=> {
        return this.userEventCollection.doc<BasicEvent>(`${eventId}`)
                   .valueChanges().pipe(first(),
                     map((event) => { return event ? { id: eventId, ...event } : null })
                   );
      })
    );
  }

  addEventByForm(formData: any, group: string): any {
    let event = formDataToEvent(formData);
    return this._addEvent(event, group)
               .then((ref) => { return { status: 'success', data: { id: ref.id }}; },
                     (err) => { return { status: 'err', data: { msg: err }} });
  }

  private _addEvent(event: BasicEvent, group: string): any {
    if (!this._authService.user) {
      ;
      return Promise.resolve('success');
    } else {
      return this.userEventCollection.add({...event})
                 .then((ref) => Promise.resolve(ref), (err) => Promise.reject(err));
    }
  }
}
