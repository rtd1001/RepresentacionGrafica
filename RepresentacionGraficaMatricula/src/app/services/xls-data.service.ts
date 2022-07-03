import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class XlsDataService {
    xlsData: any;

    getXlsData() {
        if(!this.xlsData){
            this.xlsData = JSON.parse(localStorage.getItem('excel'));
        }
        return this.xlsData;
    }

    setXlsData(data: {}) {
        this.xlsData = data;
      //  localStorage.setItem('excel', JSON.stringify(this.xlsData));
    }
}
