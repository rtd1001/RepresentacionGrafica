import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DetailsComponent } from './details/details.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from "@angular/material/icon";
import { XlsDataService } from './services/xls-data.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GrafVerticalComponent } from './graficos/graf-vertical/graf-vertical.component';
import { FiltroGraficasService } from './services/filtroGraficas.service';
import { HayFicheroGuard } from './guard/hayFichero.guard';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        DetailsComponent,
        GrafVerticalComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        NgApexchartsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatTooltipModule,
        NgxChartsModule
    ],
    providers: [XlsDataService, FiltroGraficasService, HayFicheroGuard],
    bootstrap: [AppComponent]
})
export class AppModule { }
