import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { XlsDataService } from '../xls-data.service';
import { Series } from '../series';
import { AngularMaterialModule } from 'src/angular-material.module';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
 
export class DetailsComponent implements OnInit {

  xlsData: any[];

  constructor(private router: Router, private _xlsData: XlsDataService) { }

  dynamicSeries: Array<Series> = [];
  dynamicAux: any = {};

  degrees: any = [];
  years: any = [];
  semesters: any = [];
  
  selectedDegree: any = '';
  selectedYear: any = '';
  selectedSemester: any = '';
 
  ngOnInit(): void {
    this.xlsData = this._xlsData.getXlsData();
    this.dynamicAux = {degrees: "", years: "", semesters:""};
    this.dynamicSeries.push(this.dynamicAux);
    this.degrees = this.getDegree();
  }

  getDegree(){
    var degree = [];
    for(var i = 0; i < this.xlsData.length; i++){
      var data = this.xlsData[i];
      var keys=Object.keys(data);
      for(var j = 0; j < keys.length; j++){
        var key = keys[j];
        degree.push(data[key].name);
      }
    }

    return degree;
  }

  onChartSelected(event){
    var chartCombo = document.getElementById("chart-combo")
    var e = (document.getElementById("chart-combo")) as HTMLSelectElement;
    var sel = e.selectedIndex;
    var opt = e.options[sel];
    var selectedChart  = opt.text;
  }

  addRow() {  
    this.dynamicAux = {degrees: "", years: "",semesters:""};
    this.dynamicSeries.push(this.dynamicAux);
    console.log(this.dynamicSeries);
    return true;
  }

  changeDegree(value, i){

    this.selectedDegree = value;
    this.dynamicSeries[i].degrees = this.selectedDegree;

    this.resetYear(i);
    this.resetSemester(i);

    for(var j = 0; j < this.xlsData.length; j++){
      var dataAux = this.xlsData[j];
      var data = dataAux[this.selectedDegree].data;

      var yearDuplicates = []
      Object.keys(data).forEach( key => {
        yearDuplicates.push(data[key].asig_curso);
      });
      var year = Array.from(new Set(yearDuplicates))
   
      for(var z = 0; z < year.length; z++){
        this.years.push(year[z]);
      }
    }

  }

  changeYear(value, i){

    this.selectedYear = value;
    this.dynamicSeries[i].years = this.selectedYear;

    this.resetSemester(i);

    for(var j = 0; j < this.xlsData.length; j++){
      var dataAux = this.xlsData[j];
      var selectedInfo  = dataAux[this.selectedDegree].data.filter(row => (row.asig_curso == this.selectedYear));;
      console.log(selectedInfo);
      var semesterDuplicates  = []
      Object.keys(selectedInfo).forEach( key => {
        semesterDuplicates.push(selectedInfo[key].asig_vp);
      });
      var semester = Array.from(new Set(semesterDuplicates))
      
      for(var z = 0; z < semester.length; z++){
        this.semesters.push(semester[z]);
      }
    }

  }

  changeSemester(value, i){

    this.selectedSemester = value;
    this.dynamicSeries[i].semesters = this.selectedSemester;

  }

  resetYear(i){
    //this.dynamicSeries[i].years = '';
  }

  resetSemester(i){
    this.dynamicSeries[i].semesters = '';
  }
}
