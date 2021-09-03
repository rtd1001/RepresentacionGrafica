import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { XlsDataService } from '../xls-data.service';
import { Series } from '../series';

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
  i = 0;
  degree: any = [];

  ngOnInit(): void {
    this.xlsData = this._xlsData.getXlsData();
    this.dynamicAux = {degrees: "", years: "", semesters:""};
    this.dynamicSeries.push(this.dynamicAux);
    this.degree = this.getDegree();
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

  addRow(index) {  
    this.dynamicAux = {degrees: "", years: "",semesters:""};
    this.dynamicSeries.push(this.dynamicAux);
    console.log(this.dynamicSeries);
    return true;
  }

  setYear(index){

  }
  /*
  function() {
    'use strict';
  
    this.angular
      .module('myApp', [])
      .controller('series', series);
  
    series.$inject = ['$scope'];
  
    function series($scope) {
      $scope.rows = [{}];
      $scope.nrows = [];

      $scope.addSerie = function() {
        $scope.rows.push({

        });
      };

      $scope.setDegree = function(row) {
        console.log("setDegree")
        $scope.degree = []
        for(var i = 0; i < this.xlsData.length; i++){
          var data = this.xlsData[i];
          var keys=Object.keys(data);
          for(var j = 0; j < keys.length; j++){
            var key = keys[j];
            $scope.degree.push(data[key].name);
          }
        }
      
      }
    }
  }*/
}
