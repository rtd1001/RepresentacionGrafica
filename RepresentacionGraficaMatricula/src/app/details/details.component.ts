import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { XlsDataService } from '../services/xls-data.service';
import { Series } from '../series';
import { AngularMaterialModule } from 'src/angular-material.module';

import {
  ApexChart,
  ApexAxisChartSeries,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStates,
  ApexGrid,
  ApexTitleSubtitle
} from "ng-apexcharts";

type ApexXAxis = {
  type?: "category" | "datetime" | "numeric";
  categories?: any;
  labels?: {
    style?: {
      colors?: string | string[];
      fontSize?: string;
    };
  };
};

var colors = [
  '#2685CB', 
  '#4AD95A', 
  '#FEC81B', 
  '#FD8D14', 
  '#CE00E6', 
  '#4B4AD3', 
  '#FC3026', 
  '#B8CCE3', 
  '#6ADC88', 
  '#FEE45F' 
];

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  subtitle: ApexTitleSubtitle;
  colors: string[];
  states: ApexStates;
  title: ApexTitleSubtitle;
  legend: ApexLegend;
  tooltip: any; //ApexTooltip;
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

  loaded: boolean = false;
 
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
    this.chartOptions ={
      series: [
        {
          name: "year",
          data: this.makeData()
        }
      ],
      chart: {
        id: "barYear",
        height: 400,
        width: "100%",
        type: "bar",
        /*events: {
          dataPointSelection: (e, chart, opts) => {
            var quarterChartEl = document.querySelector("#chart-quarter");
            var yearChartEl = document.querySelector("#chart-year");

            if (opts.selectedDataPoints[0].length === 1) {
              if (quarterChartEl.classList.contains("active")) {
                this.updateQuarterChart(chart, "barQuarter");
              } else {
                yearChartEl.classList.add("chart-quarter-activated");
                quarterChartEl.classList.add("active");
                this.updateQuarterChart(chart, "barQuarter");
              }
            } else {
              this.updateQuarterChart(chart, "barQuarter");
            }

            if (opts.selectedDataPoints[0].length === 0) {
              yearChartEl.classList.remove("chart-quarter-activated");
              quarterChartEl.classList.remove("active");
            }
          },
          updated: (chart) => {
            this.updateQuarterChart(chart, "barQuarter");
          }
        }*/
      },
      plotOptions: {
        bar: {
          distributed: true,
          horizontal: false,
          barHeight: "75%",
          dataLabels: {
            position: "bottom"
          }
        }
      },
      dataLabels: {
        enabled: true,
        textAnchor: "start",
        style: {
          colors: ["#fff"]
        },
        formatter: function(val, opt) {
          return opt.w.globals.labels[opt.dataPointIndex];
        },
        offsetX: 0,
        dropShadow: {
          enabled: true
        }
      },

      colors: colors,

      states: {
        normal: {
          filter: {
            type: "desaturate"
          }
        },
        active: {
          allowMultipleDataPointsSelection: true,
          filter: {
            type: "darken",
            value: 1
          }
        }
      },
      tooltip: {
        x: {
          show: false
        },
        y: {
          title: {
            formatter: function(val, opts) {
              return opts.w.globals.labels[opts.dataPointIndex];
            }
          }
        }
      },
      title: {
        text: "Matriculados en grupos teóricos",
        offsetX: 15
      },
      subtitle: {
        text: "(Haz click en la barra para ver detalles)",
        offsetX: 15
      },
      yaxis: {
        min: 0,
        max:500,
        tickAmount: 20,
        labels: {
          show: true
        },
      }
    }
  }

  makeData() : any{
    
    var total = [];
    var dataSerie = [];
    var dataGroup = [];
    console.log(this.dynamicSeries)
    for(var i = 0; i < this.dynamicSeries.length; i++){

      var data = this.xlsData[this.dynamicSeries[i].docs];
      console.log(this.dynamicSeries[i])

      var info = data[this.dynamicSeries[i].degrees].data.filter(row => (row.asig_curso == this.dynamicSeries[i].years 
        && row.asig_vp == this.dynamicSeries[i].semesters 
        && row.asig_tipAcademica == 'Teoría' 
        && row.asig_activ == 'S' ));

      var groupsDuplicates = [];
      Object.keys(info).forEach(key => {
        groupsDuplicates.push(info[key].asig_grupo);
      });

      var groups = Array.from(new Set(groupsDuplicates));

      var totalAux  = 0;
      for(var j = 0; j < groups.length; j++){
        
        var info_group = info.filter(row => row.asig_grupo == groups[j])
        console.log(info_group);
        
        Object.keys(info_group).forEach(key => {
          console.log('total'+ info_group[key].alum_total)
        });


      }

      dataSerie[i] = {
        x: this.dynamicSeries[i].degrees,
        y: totalAux,
        color: colors[i]
      }
    }
    this.loaded = true;
    return dataSerie;
  }



}
