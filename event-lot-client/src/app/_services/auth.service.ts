import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';

import { auth } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user: any;

  constructor(private afAuth: AngularFireAuth) {
    this._user = this.afAuth.authState.pipe(
      map((user) => {
        return user ?
          {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            phone: user.phoneNumber
          } : null;
      })
    );
  }

  login() {
    return this.afAuth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  logout() {
    this.afAuth.signOut();
  }

  user() {
    return this._user;
  }
}
