import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class XlsDataService {
  xlsData:any;

  getXlsData(){
    return this.xlsData;
  }

  setXlsData(data:any[]){
    this.xlsData = data;
  }
}
