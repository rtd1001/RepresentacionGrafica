import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Series } from 'src/app/series';
import { XlsDataService } from 'src/app/services/xls-data.service';

@Component({
  selector: 'app-filtro2',
  templateUrl: './filtro2.component.html',
  styleUrls: ['./filtro2.component.css']
})
export class Filtro2Component implements OnInit {

  dynamicSeries: Array<Series> = [];
  dynamicAux: any = {};
  xlsData: any[];

  degreesList = {}
  yearsList = {}
  docsList = []

  selectedDoc: any = '';
  selectedDegree: any = '';
  selectedYear: any = '';

  @Output()borraGrafica:EventEmitter<number>=new EventEmitter();

  constructor(
    private _xlsData: XlsDataService
  ) { }

  ngOnInit(): void {
    this.dynamicAux = { degrees: "", years: "" };
    this.dynamicSeries.push(this.dynamicAux);


    //Obtengo el excel y saco el listado de documentos
    this.xlsData = this._xlsData.getXlsData();
    this.docsList = this.getDocs();
  }

  /**
     * Obtiene el listado de documentos
     * @returns Listado de documentos según los excel subidos
     */
   getDocs() {
    const docs = [];
    for (const key of Object.keys(this.xlsData)) {
        docs.push(key);
    }
    return docs;
}

addRow() {
  this.dynamicAux = { docs: "", degrees: "", years: ""};
  this.dynamicSeries.push(this.dynamicAux);
  return true;
}

changeDoc(value, i) {
  this.borraGrafica.emit(1);
  this.selectedDoc = value;
  this.dynamicSeries[i].docs = this.selectedDoc;

  this.resetDegree(i);
  this.resetYear(i);
 // this.resetSemester(i);
  var info = this.xlsData[this.selectedDoc];

  var xlsDataKey = Object.keys(info);
  var degreData = Object.values(xlsDataKey);
  var listAux = [];
  for (var j = 0; j < degreData.length; j++) {
      listAux.push(degreData[j]);
  }
  this.degreesList[i] = listAux;


}

changeDegree(value, i) {
  this.borraGrafica.emit(1);
  this.selectedDegree = value;
  this.dynamicSeries[i].degrees = this.selectedDegree;

  this.resetYear(i);
 // this.resetSemester(i);

  var info = this.xlsData[this.selectedDoc];

  var data = info[this.selectedDegree].data;

  var yearDuplicates = []
  Object.keys(data).forEach(key => {
      yearDuplicates.push(data[key].asig_curso);
  });

  var year = Array.from(new Set(yearDuplicates))
  var listAux = [];
  for (var z = 0; z < year.length; z++) {
      listAux.push(year[z]);
  }
  this.yearsList[i] = listAux;
}

changeYear(value, i) {
this.borraGrafica.emit(1);
  this.selectedYear = value;
  this.dynamicSeries[i].years = this.selectedYear;

 // this.resetSemester(i);

  var info = this.xlsData[this.selectedDoc];

  var selectedInfo = info[this.selectedDegree].data.filter(row => (row.asig_curso == this.selectedYear));;

  var semesterDuplicates = []
  Object.keys(selectedInfo).forEach(key => {
      semesterDuplicates.push(selectedInfo[key].asig_vp);
  });
  var semester = Array.from(new Set(semesterDuplicates))
  var listAux = []
  for (var z = 0; z < semester.length; z++) {
      listAux.push(semester[z]);
  }
//  this.semestersList[i] = listAux;

}

resetDegree(i) {
  this.dynamicSeries[i].degrees = "";
}

resetYear(i) {
  this.dynamicSeries[i].years = "";
}

makeData(): any {

  let serieCompleta = true;
    for (var i = 0; i < this.dynamicSeries.length; i++) {
        Object.keys(this.dynamicSeries[i]).forEach(key => {
            if (this.dynamicSeries[i][key] === "") {
                serieCompleta = false;
            }
        });
    }

    if (!serieCompleta) {
        alert('Las series no están completas. Termine de seleccionar las opciones.');
    } else{

      var dataSerie = [];
      console.log(this.dynamicSeries.length)
      /*
      for (var i = 0; i < this.dynamicSeries.length; i++) {
          var descriptionArray = [];

          var data = this.xlsData[this.dynamicSeries[i].docs];
          var info = data[this.dynamicSeries[i].degrees].data.filter(row => (
              row.asig_curso == this.dynamicSeries[i].years
              && row.asig_tipAcademica == 'Teoría'
              && row.asig_activ == 'S'));
              console.log('info')   
          console.log(info)
          var groupsDuplicates = [];
          var descriptionDuplicates = [];
          Object.keys(info).forEach(key => {
              groupsDuplicates.push(info[key].asig_grupo);
              descriptionDuplicates.push(info[key].asig_descripcion);
          });

          var groups = Array.from(new Set(groupsDuplicates));
          var description = Array.from(new Set(descriptionDuplicates));
          descriptionArray.push(description);
          console.log('groups')
          console.log(groups)
          console.log('description')
          console.log(description)
          var descpInfo = {};
          var series = []
          var sumaGrupo = 0;

        for (var z = 0; z < description.length; z++){

          var info_description = info.filter(row => row.asig_descripcion == description[z])
          console.log(info_description)

          sumaGrupo = 0;
          for (var j = 0; j < groups.length; j++) {

            var info_group = info_description.filter(row => row.asig_grupo == groups[j])
            console.log(info_group)

            Object.keys(info_group).forEach(key => {
                sumaGrupo += info_group[key].alum_total;

            });
          }


          var groupInfo = []
          groupInfo.push({
            name: this.dynamicSeries[i].docs,
            value: sumaGrupo
          })

          series.push(groupInfo);

          dataSerie[z] = {
            name: description[z],
            series: groupInfo
          }
        }

        
      }*/


      for (var i = 0; i < this.dynamicSeries.length; i++) {
        var descriptionArray = [];

        var data = this.xlsData[this.dynamicSeries[0].docs];
        var info = data[this.dynamicSeries[0].degrees].data.filter(row => (
            row.asig_curso == this.dynamicSeries[0].years
            && row.asig_tipAcademica == 'Teoría'
            && row.asig_activ == 'S'));
            console.log('info')   
        console.log(info)
        var groupsDuplicates = [];
        var descriptionDuplicates = [];
        Object.keys(info).forEach(key => {
            groupsDuplicates.push(info[key].asig_grupo);
            descriptionDuplicates.push(info[key].asig_descripcion);
        });

        var groups = Array.from(new Set(groupsDuplicates));
        var description = Array.from(new Set(descriptionDuplicates));
        descriptionArray.push(description);
        console.log('groups')
        console.log(groups)
        console.log('description')
        console.log(description)

        var series = []
        var sumaGrupo = 0;

        for (var z = 0; z < description.length; z++){

          var info_description = info.filter(row => row.asig_descripcion == description[z])
          console.log(info_description)

          sumaGrupo = 0;
          for (var j = 0; j < groups.length; j++) {

            var info_group = info_description.filter(row => row.asig_grupo == groups[j])
            console.log(info_group)

            Object.keys(info_group).forEach(key => {
                sumaGrupo += info_group[key].alum_total;

            });
          }

          var groupInfo = []
          groupInfo.push({
            name: this.dynamicSeries[i].docs,
            value: sumaGrupo
          })
          groupInfo[z]
          
          dataSerie[z] = {
            name: description[z],
            series: groupInfo
          }

          /*    var groupInfo = {}
          groupInfo = {
            name: this.dynamicSeries[i].docs,
            value: sumaGrupo
          }*/
          /*
          var groupInfo = []
          groupInfo.push({
            name: this.dynamicSeries[i].docs,
            value: sumaGrupo
          })
          */
        
           //  series[z] = groupInfo;
          /*   dataSerie[z] = {
            name: description[z],
            series: series
          }*/
          /*
          if (i = 0){
            dataSerie[z] = {
              name: description[z],
              series: groupInfo
            }
          }else{
            dataSerie[z] = {
              name: description[z],
              series: series.push(groupInfo)
            }
          }
          */
        
        }


      }




      /*
        for (var w = 0; w < description.length; w++){


          dataSerie[w] = {
            name: description[w],
            series: groupInfo[w]
          }
          
        }*/
        console.log('dataSerie')
        console.log(dataSerie)
        /*
        dataSerie[i] = {
            x: this.selectedDegree + '-' + this.selectedYear + '-' + this.selectedSemester,
            y: average,
            maxY: maxAverage,
        //    chartInfo: groupInfo,
            des: descriptionArray,
            maxY_group: maxGroup
        }
      */
        return dataSerie;


    }//else
  }//makeData
  
}//class
