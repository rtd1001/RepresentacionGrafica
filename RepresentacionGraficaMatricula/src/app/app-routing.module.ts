import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { DetailsComponent } from './details/details.component';
import { HayFicheroGuard } from './guard/hayFichero.guard';

const routes: Routes = [
    { path: 'home-component', component: HomeComponent },
    { path: 'details', component: DetailsComponent, canActivate:[HayFicheroGuard] },
    { path: '', redirectTo: 'home-component', pathMatch: 'full' }, //por defecto
    { path: '**', component: HomeComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
