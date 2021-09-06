import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { XlsDataService } from '../services/xls-data.service';
import { Series } from '../series';
import { AngularMaterialModule } from 'src/angular-material.module';

import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexResponsive,
  ApexXAxis,
  ApexLegend,
  ApexFill
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  legend: ApexLegend;
  fill: ApexFill;
};

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
 
export class DetailsComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  xlsData: any[];

  constructor(private router: Router, private _xlsData: XlsDataService) { }

  dynamicSeries: Array<Series> = [];
  dynamicAux: any = {};

  degrees: any = [];
  years: any = [];
  semesters: any = [];
  docs: any = [];
  
  selectedDoc: any = '';
  selectedDegree: any = '';
  selectedYear: any = '';
  selectedSemester: any = '';
  selectedChart: any = '';
 
  ngOnInit(): void {
    this.xlsData = this._xlsData.getXlsData();
    this.dynamicAux = {degrees: "", years: "", semesters:""};
    this.dynamicSeries.push(this.dynamicAux);
    //this.degrees = this.getDegree();
    this.docs = this.getDoc();
    console.log(this.xlsData)
  }

  getDoc(){
    var doc = [];
    var xlsDataKey = Object.keys(this.xlsData);
    for(var i = 0; i < xlsDataKey.length; i++){
      doc.push(xlsDataKey[i]);
    }
    return doc;
  }
/*
  getDegree(){
    var degree = [];

    var xlsDataVal = Object.values(this.xlsData);
    for(var i = 0; i < xlsDataVal.length; i++){
      var data = xlsDataVal[i];
      var keys=Object.keys(data);
      for(var j = 0; j < keys.length; j++){
        var key = keys[j];
        degree.push(data[key].name);
      }
    }

    return degree;
  }
*/
  onChartSelected(event){
    var chartCombo = document.getElementById("chart-combo")
    var e = (document.getElementById("chart-combo")) as HTMLSelectElement;
    this.selectedChart = e.selectedIndex;
    /*var opt = e.options[sel];
    this.selectedChart  = opt.text;
    console.log(sel)*/
  }

  addRow() {  
    this.dynamicAux = {degrees: "", years: "",semesters:""};
    this.dynamicSeries.push(this.dynamicAux);
    console.log(this.dynamicSeries);
    return true;
  }

  changeDoc(value, i){
    
    this.selectedDoc = value;
    this.dynamicSeries[i].docs = this.selectedDoc;
    
    var info = this.xlsData[this.selectedDoc];
    var xlsDataKey = Object.keys(info);

    var degreData = Object.values(xlsDataKey);
    for(var j = 0; j < degreData.length; j++){
      this.degrees.push(degreData[j]);
    }

    /*
    for(var j = 0; j < xlsDataVal.length; j++){
      var data = xlsDataVal[i];
      var keys=Object.keys(data);
      for(var j = 0; j < keys.length; j++){
        var key = keys[j];
        degree.push(data[key].name);
      }
    }*/
    
  }

  changeDegree(value, i){

    this.selectedDegree = value;
    this.dynamicSeries[i].degrees = this.selectedDegree;

    this.resetYear(i);
    this.resetSemester(i);

    var info = this.xlsData[this.selectedDoc];

    var data = info[this.selectedDegree].data;
    
    var yearDuplicates = []
    Object.keys(data).forEach( key => {
      yearDuplicates.push(data[key].asig_curso);
    });
    console.log('yearD' + yearDuplicates)
    var year = Array.from(new Set(yearDuplicates))
    console.log('year' + year)
    for(var z = 0; z < year.length; z++){
      this.years.push(year[z]);
    }
    
    /*
    var xlsDataVal = Object.values(this.xlsData);
    for(var j = 0; j < xlsDataVal.length; j++){
      var dataAux = xlsDataVal[j];
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
    */
  }
 
  changeYear(value, i){

    this.selectedYear = value;
    this.dynamicSeries[i].years = this.selectedYear;

    this.resetSemester(i);

    var info = this.xlsData[this.selectedDoc];

    var selectedInfo  = info[this.selectedDegree].data.filter(row => (row.asig_curso == this.selectedYear));;
    
    var semesterDuplicates  = []
    Object.keys(selectedInfo).forEach( key => {
      semesterDuplicates.push(selectedInfo[key].asig_vp);
    });
    var semester = Array.from(new Set(semesterDuplicates))
    
    for(var z = 0; z < semester.length; z++){
      this.semesters.push(semester[z]);
    }
  
      
    /*
    var xlsDataVal = Object.values(this.xlsData);
    for(var j = 0; j < xlsDataVal.length; j++){
      var dataAux = xlsDataVal[j];
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
    }*/

  }

  changeSemester(value, i){

    this.selectedSemester = value;
    this.dynamicSeries[i].semesters = this.selectedSemester;

  }

  resetYear(i){
    //document.querySelectorAll('#selectYear option').forEach(option => option.remove())
  }

  resetSemester(i){

  }

  createChart(){
    switch(this.selectedChart){
      case 1:
        this.createBarChart();
        break;
      case 2:
        break;
    }
  }

  createBarChart(){

  }
}
