import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { XlsDataService } from '../xls-data.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  xlsData: any[];

  constructor(private router: Router, private _xlsData: XlsDataService) { 
    
  }

  ngOnInit(): void {
  }

  viewData(event){
    this.xlsData = this._xlsData.getXlsData();
    console.log('detail');
    console.log(this.xlsData);
  }
}
