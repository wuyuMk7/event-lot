import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environments as Environments } from './_envs/environments';

import { MaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AuthService } from './_services/auth.service';
import { EventService } from './_services/event.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(Environments.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    MaterialModule
  ],
  providers: [
    AuthService,
    EventService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
