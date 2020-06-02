import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  public user: any;

  constructor(private _authService: AuthService) { 
    this.user = this._authService.user();
  }

  ngOnInit() {
  }

  login() {
    this._authService.login();
  }

  logout() {
    this._authService.logout();
  }
}
