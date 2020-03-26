import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NewChartComponent } from './new-chart/new-chart.component';
import { EditChartComponent } from './edit-chart/edit-chart.component';
import { NewChartFromDataComponent } from './new-chart-from-data/new-chart-from-data.component';
import { EditChartTypeComponent } from './edit-chart-type/edit-chart-type.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NewChartComponent,
    EditChartComponent,
    NewChartFromDataComponent,
    EditChartTypeComponent,
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
