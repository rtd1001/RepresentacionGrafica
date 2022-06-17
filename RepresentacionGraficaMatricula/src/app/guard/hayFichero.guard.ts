import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { XlsDataService } from '../services/xls-data.service';
/** Guard que comprueba si un usuario está logado, si lo está, lo permite */
@Injectable()
export class HayFicheroGuard implements CanActivate {
    constructor(
        private xlsData: XlsDataService,
        private router:Router
    ) { }
    /** Comprobación
     *  @returns Si está logado
     */
    canActivate():boolean {
        if (this.xlsData.getXlsData()) {
            return true;
        } else {
            this.router.navigate(['home-component']);
            return false;
        }
    }
}