import { Component, OnInit, ResolvedReflectiveFactory, ViewChild } from '@angular/core';
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
  ApexTitleSubtitle,
  ApexResponsive
} from "ng-apexcharts";

type ApexXAxis = {
  type?: "category" | "datetime" | "numeric";
  categories?: any;
  labels?: {
    style?: {
      colors?: string | string[];
      fontSize?: string;
    };
    show?: any;
    rotate?: any;
    hideOverlappingLabels?: any;
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
  responsive: ApexResponsive[];
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
  public chartInfoOptions: Partial<ChartOptions>;

  xlsData: any[];

  constructor(private router: Router, private _xlsData: XlsDataService) { }

  dynamicSeries: Array<Series> = [];
  dynamicAux: any = {};

  degrees: any = [];
  years: any = [];
  semesters: any = [];
  docs: any = [];
  
  degreesList = {}
  yearsList = {}
  semestersList = {}
  docsList = []


  selectedDoc: any = '';
  selectedDegree: any = '';
  selectedYear: any = '';
  selectedSemester: any = '';
  selectedChart = 0;

  loaded: boolean = false;
  loaded2: boolean = false;
  //description: any = [];
 
  ngOnInit(): void {
    this.xlsData = this._xlsData.getXlsData();
    this.dynamicAux = {degrees: "", years: "", semesters:""};
    this.dynamicSeries.push(this.dynamicAux);
    //this.degrees = this.getDegree();
    //this.docs = this.getDoc();
    this.docsList = this.getDoc();
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
    var e = (document.getElementById("chart-combo")) as HTMLSelectElement;
    this.selectedChart = e.selectedIndex;
    /*var opt = e.options[sel];
    this.selectedChart  = opt.text;
    console.log(sel)*/
  }

  addRow() {  
    this.dynamicAux = {docs: "", degrees: "", years: "",semesters:""};
    this.dynamicSeries.push(this.dynamicAux);
    console.log(this.dynamicSeries);
    return true;
  }

  changeDoc(value, i){
    this.resertChart();
    this.selectedDoc = value;
    this.dynamicSeries[i].docs = this.selectedDoc;
    
    this.resetDegree(i);
    this.resetYear(i);
    this.resetSemester(i);

    var info = this.xlsData[this.selectedDoc];
    var xlsDataKey = Object.keys(info);

    var degreData = Object.values(xlsDataKey);
    var listAux = [];
    for(var j = 0; j < degreData.length; j++){
      listAux.push(degreData[j]);
    }

    this.degreesList[i] = listAux;
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
    this.resertChart();
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
    
    var year = Array.from(new Set(yearDuplicates))
    var listAux = [];
    for(var z = 0; z < year.length; z++){
      listAux.push(year[z]);
    }
    this.yearsList[i] = listAux;
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
    this.resertChart();
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
    var listAux = []
    for(var z = 0; z < semester.length; z++){
      listAux.push(semester[z]);
    }
    this.semestersList[i] = listAux;
      
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
    this.resertChart();
    this.selectedSemester = value;
    this.dynamicSeries[i].semesters = this.selectedSemester;

  }

  resetDegree(i){
    this.dynamicSeries[i].degrees = "";
  }

  resetYear(i){
    this.dynamicSeries[i].years = "";
  }

  resetSemester(i){
    this.dynamicSeries[i].semesters = "";
  }

  resertChart(){

    if(this.loaded === true){
      this.loaded = false;
    }
    
  }

  createChart(){
    if(this.selectedChart == 0){
      alert('No ha seleccionado una gráfica. Seleccione la gráfica que desea.');
    }

    var ready = true;
    for(var i=0; i < this.dynamicSeries.length; i++){
        Object.keys(this.dynamicSeries[i]).forEach( key => {
          if(this.dynamicSeries[i][key] === ""){
            ready = false;
            
          }
        });
    }

    if(!ready){
      alert('Las series no están completas. Termine de seleccionar las opciones.');
    }else{
      switch(this.selectedChart){
        case 1:
          this.createBarChart();
          break;
        case 2:
          break;
      }
    }
    
  }

  createBarChart(){
    var result = this.makeData();
    
    this.chartOptions ={
      series: [
        {
          name: "year",
          data: result
        }
      ],
      chart: {
        id: "barYear",
        height: 400,
        width: "100%",
        type: "bar",
        events: {
          
          dataPointSelection: (e, chart, opts) => {
            var chartInfoEl = document.querySelector("#chart-info");
            var barChartEl = document.querySelector("#bar-chart");
            this.loaded2 = true;
            console.log(opts)
            //index = opts.selectedDataPoints
            if (opts.selectedDataPoints[0].length === 1) {

              if (chartInfoEl.classList.contains("active")) {
                //this.updateQuarterChart(chart, "barInfo");
              } else {
                barChartEl.classList.add("chart-info-activated");
                chartInfoEl.classList.add("active");
                this.updateInfoChart(chart, "barInfo");
              }
            }

            if (opts.selectedDataPoints[0].length === 0) {
              barChartEl.classList.remove("chart-info-activated");
              chartInfoEl.classList.remove("active");
            }
          },
          updated: (chart) => {
            this.updateInfoChart(chart, "barInfo");
          }
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0
            }
          }
        }
      ],
      plotOptions: {
        bar: {
          distributed: true,
          horizontal: false,
          barHeight: "75%",
          
        }
      },
      dataLabels: {
        enabled: false,
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
          allowMultipleDataPointsSelection: false,
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
        text: "Total de matriculados en grupos teóricos",
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
      },
      xaxis:{
        labels: {
          show: false
        }
      }
    }
    
    this.chartInfoOptions = {
      series: [
        {
          name: "Asignaturas",
          data: []
        }
      ],
      chart: {
        id: "barInfo",
        height: 400,
        width: "100%",
        type: "bar",
        stacked: true
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0
            }
          }
        }
      ],
      plotOptions: {
        bar: {
          columnWidth: "60%",
          horizontal: false
        }
      },
      legend: {
        show: true,
        position: 'right',
        offsetY: 40
      },
      grid: {
        yaxis: {
          lines: {
            show: true
          }
        },
        xaxis: {
          lines: {
            show: true
          }
        }
      },
      xaxis: {
        labels:{
          rotate: 0,
          hideOverlappingLabels: false
        }
      },
      yaxis: {
        min: 0,
        max: 200,
        tickAmount: 20,
      },
      title: {
        text: "Matriculados en cada asignatura por grupo teórico",
        offsetX: 10
      },
      subtitle: {
        
      },
      tooltip: {
        x: {
          formatter: function (val, opts) {
            return opts.w.globals.seriesNames[opts.seriesIndex];
          }
        },
        y: {
          title: {
            formatter: function (val, opts) {
              return opts.w.globals.labels[opts.dataPointIndex];
            }
          }
        }
      }
    }
    
    
  }

  

  makeData() : any{

    var dataSerie = [];

    for(var i = 0; i < this.dynamicSeries.length; i++){
      var descriptionArray = [];

      var data = this.xlsData[this.dynamicSeries[i].docs];
      console.log(this.dynamicSeries[i])

      var info = data[this.dynamicSeries[i].degrees].data.filter(row => (row.asig_curso == this.dynamicSeries[i].years 
        && row.asig_vp == this.dynamicSeries[i].semesters 
        && row.asig_tipAcademica == 'Teoría' 
        && row.asig_activ == 'S' ));

      var groupsDuplicates = [];
      var descriptionDuplicates = [];
      Object.keys(info).forEach(key => {
        groupsDuplicates.push(info[key].asig_grupo);
        descriptionDuplicates.push(info[key].asig_descripcion);
      });

      var groups = Array.from(new Set(groupsDuplicates));
      var description = Array.from(new Set(descriptionDuplicates));
      descriptionArray.push(description);

      var total  = 0;
      var groupInfo = [];
      for(var j = 0; j < groups.length; j++){
        
        var info_group = info.filter(row => row.asig_grupo == groups[j])

        var totalEachGroup = []
        Object.keys(info_group).forEach(key => {
          
          total += info_group[key].alum_total;
          totalEachGroup.push(info_group[key].alum_total)
        });

        
        groupInfo[j] = {
          x: "Grupo" + groups[j], 
          y: totalEachGroup
        }

      }
      dataSerie[i] = {
        x: this.dynamicSeries[i].degrees,
        y: total,
        color: colors[i],
        chartInfo: groupInfo,
        des: descriptionArray
      }
     
    }
    this.loaded = true;

    return dataSerie;
  }

  public updateInfoChart(sourceChart, destChartIDToUpdate) {
    
    var series = [];
    var categories = [];
    var seriesIndex = 0;
    var colorsArray = ['#00B3E6', 
    '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D','#FF6633', '#FFB399', '#FF33FF', '#FFFF99'];
    var colors = [];
    var degreeName = '';

    if (sourceChart.w.globals.selectedDataPoints[0]) {
      var selectedPoints = sourceChart.w.globals.selectedDataPoints;
      for (var i = 0; i < selectedPoints[seriesIndex].length; i++) {
        var selectedIndex = selectedPoints[seriesIndex][i];
        var yearSeries = sourceChart.w.config.series[seriesIndex];
        degreeName = yearSeries.data[selectedIndex].x;
        var getInfo = yearSeries.data[selectedIndex].chartInfo;
        
        for(var j = 0; j < getInfo.length; j++){
          series.push({
            name: getInfo[j].x,
            data: getInfo[j].y
          })
          colors.push(colorsArray[j])
        }

        var getDescription = yearSeries.data[selectedIndex].des;
        console.log('des')
        console.log(getDescription)
        var getDescriptionValues = getDescription[0];
        for(var j = 0; j < getDescriptionValues.length; j++){
          var value = getDescriptionValues[j].toString();
          console.log(value)
          var array = value.split(' ');
          console.log(array)
          categories.push(array);
        }
      }
      console.log('cat')
      console.log(categories)
      if (series.length === 0)
        series = [
          {
            data: []
          }
        ];

      return window.ApexCharts.exec(destChartIDToUpdate, "updateOptions", {
        series: series,
        colors: colors,
        fill: {
          colors: colors
        },
        xaxis: {
          type: "category",
          categories: categories
        },
        subtitle:{
          text: degreeName,
          offsetX: 15
        }
        
      });
    }
  }

}
