import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {DemoMaterialModule} from './material-module';
import {MatNativeDateModule} from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import { MyTzAppComponent } from './my-tz-app/my-tz-app.component';
import { UsersListComponent } from './users-list/users-list.component';

import {DataElasticService} from './service/data-elastic.service';
@NgModule({
  declarations: [
    AppComponent,
    MyTzAppComponent,
    UsersListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DemoMaterialModule,
    MatNativeDateModule,
  ],
  providers: [DataElasticService],
  bootstrap: [AppComponent]
})
export class AppModule { }
