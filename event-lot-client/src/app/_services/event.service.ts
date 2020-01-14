import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, combineLatest } from 'rxjs';
import { map, first, mergeMap, filter } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { BasicEvent, Event, formDataToEvent, EventStatus, Lifecycle } from '../_models/event';

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
          return { id: id, groupid: '', ...data };
        }))
      )
    });
  }

  getAllEvents(timestamp: number): Observable<Event[]> {
    return this._authService.user().pipe(
      mergeMap((user: any) => {
        const afs1 = this._db.collection<BasicEvent>(`records/${user.uid}/events`,
          ref => ref.where('start_time', '<=', timestamp)
        ).snapshotChanges();
        const afs2 = this._db.collection<BasicEvent>(`records/${user.uid}/events`,
          ref => ref.where('lifecycle', '==', Lifecycle.Lifelong)
        ).snapshotChanges();

        return combineLatest(afs1, afs2).pipe(
          map(([first, second]) => {
            const arr = [...first, ...second];
            return arr.filter((v, i) =>
              arr.findIndex(_v => _v.payload.doc.id == v.payload.doc.id) === i);
          }),
          map(events => events.filter(
            event => event.payload.doc.data().lifecycle === Lifecycle.Lifelong
                     || event.payload.doc.data().end_time >= timestamp)),
          map(events => events.map(event => {
            const data = event.payload.doc.data() as BasicEvent;
            const id = event.payload.doc.id;
            return { id: id, groupid: '', ...data };
          }))
        );
      })
    );
  }

  getEvent(eventId: string, group: string): Observable<Event>{
    return this._authService.user().pipe(
             mergeMap((user:any) =>
               this.userEventCollection.doc<BasicEvent>(`${eventId}`)
                 .valueChanges().pipe(
                   first(),
                   map((event) => { return event ? { id: eventId, groupid: '', ...event } : null })
                 )
             )
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
