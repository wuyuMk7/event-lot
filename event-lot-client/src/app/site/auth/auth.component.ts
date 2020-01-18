import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  public user: any;

  constructor(
    private _authService: AuthService,
    private _router: Router
  ) {
    this.user = this._authService.user();
    this.user.subscribe((user) => {
      if (user)
        this._router.navigate(['events']);
    });
  }

  ngOnInit() {
  }

  login() {
    this._authService.login().then(
      res => this._router.navigate(['events']),
      err => console.log(err)
    );
  }

  logout() {
    this._authService.logout();
  }

}
