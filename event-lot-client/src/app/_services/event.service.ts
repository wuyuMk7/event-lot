import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, combineLatest } from 'rxjs';
import { map, first, mergeMap, filter } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { BasicEvent, Event, formDataToEvent, EventStatus, Lifecycle, RepeatMode } from '../_models/event';

import * as moment from 'moment-timezone';

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
          map(events => events.filter(
            event => {
              let ret = false;
              if (event.payload.doc.data().has_notification) {
                const tz_time = moment.unix(timestamp/1000).tz(event.payload.doc.data().timezone);
                const month = tz_time.month(), date = tz_time.date(), weekday = tz_time.day();
                switch (event.payload.doc.data().repeat_mode) {
                case RepeatMode.Day:
                  ret = true;
                  break;
                case RepeatMode.Week:
                  for (let freq of event.payload.doc.data().repeat_frequency) {
                    if (freq[0] === weekday){
                      ret = true;
                      break;
                    }
                  }
                  break;
                case RepeatMode.Month:
                  for (let freq of event.payload.doc.data().repeat_frequency) {
                    if (freq[0] === date){
                      ret = true;
                      break;
                    }
                  }
                  break;
                case RepeatMode.Year:
                  for (let freq of event.payload.doc.data().repeat_frequency) {
                    if (freq[0] === month && freq[1] === date){
                      ret = true;
                      break;
                    }
                  }
                  break;
                default:
                  break;
                }
              }
              return ret;
            }
          )),
          map(events => events.map(event => {
            const data = event.payload.doc.data() as BasicEvent;
            const id = event.payload.doc.id;
            const tsNow = Date.now();
            if (event.payload.doc.data().lifecycle == Lifecycle.Lifelong || (
                event.payload.doc.data().start_time <= tsNow &&
                event.payload.doc.data().end_time >= tsNow &&
                event.payload.doc.data().status == EventStatus.Pending))
              event.payload.doc.ref.update({ status: EventStatus.Ongoing });
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

  updateEvent(content: any, eventId: string, groupId: string): any {
    return this._updateEvent(content, eventId, groupId).pipe(
      map((promise:any) => promise.then(
        (ref) => { return { status: 'success', data: {} } },
        (err) => { return { status: 'err', data: { msg: err } } })
      )
    );
  }

  private _updateEvent(content: any, eventId: string, group: string): any {
    return this._authService.user().pipe(
      map((user: any) =>
        this._db.doc<Event>(`records/${user.uid}/events/${eventId}`)
          .update(content)
          .then((ref) => Promise.resolve(ref), (err) => Promise.reject(err))
      )
    );
  }

  deleteEvent(eventId: string, groupId: string): any {
    return this._deleteEvent(eventId, groupId).pipe(
      map((promise:any) => promise.then(
        (ref) => { return { status: 'success', data: {} } },
        (err) => { return { status: 'err', data: { msg: err } } })
      )
    );
  }

  private _deleteEvent(eventId: string, group: string): any {
    return this._authService.user().pipe(
      map((user: any) =>
        this._db.doc<Event>(`records/${user.uid}/events/${eventId}`)
          .delete()
          .then((ref) => Promise.resolve(ref), (err) => Promise.reject(err))
      )
    );
  }
}
