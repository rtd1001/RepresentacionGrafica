import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Series } from 'src/app/series';
import { XlsDataService } from 'src/app/services/xls-data.service';

@Component({
  selector: 'app-filtro4',
  templateUrl: './filtro4.component.html',
  styleUrls: ['./filtro4.component.css']
})
export class Filtro4Component implements OnInit {

  
  dynamicSeries: Array<Series> = [];
  dynamicAux: any = {};
  xlsData: any[];

  degreesList = []
  yearsList = []
  docsList = []

  selectedDoc: any = '';
  selectedDegree: any = '';
  selectedYear: any = '';

  @Output()borraGrafica:EventEmitter<number>=new EventEmitter();

  formSeries: FormGroup = new FormGroup({
  });

  constructor(
    private _xlsData: XlsDataService
  ) { }

  ngOnInit(): void {
    this.addRow();
    
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
  const i = this.dynamicSeries.length;
  if (i < 5) {
      this.formSeries.addControl(`doc${i}`, new FormControl());
      this.formSeries.addControl(`degree${i}`, new FormControl());
      this.formSeries.addControl(`year${i}`, new FormControl());
      this.formSeries.get(`doc${i}`).valueChanges.subscribe(doc => {
          this.changeDoc(i, doc);
      })
      this.formSeries.get(`degree${i}`).valueChanges.subscribe(degree => {
          this.changeDegree(i, degree);
      })
      this.formSeries.get(`year${i}`).valueChanges.subscribe(year => {
          this.changeYear(i, year);
      })
      this.dynamicSeries.push({ docs: "", degrees: "", years: "" });
  } else {
      alert('Limite de series alcanzado')
  }
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

borraDynamicSerie(i) {
  this.dynamicSeries.splice(i, 1);
  this.formSeries.removeControl(`doc${i}`);
  this.formSeries.removeControl(`degree${i}`);
  this.formSeries.removeControl(`year${i}`);
  this.degreesList[i] = [];
  this.yearsList[i] = [];
}

fillSerie(iActual) {
  const degreeValue = this.formSeries.get(`degree${iActual}`).value;
  const yearValue = this.formSeries.get(`year${iActual}`).value;
  for (let i = 0; i < this.dynamicSeries.length; i++) {
      if (i === iActual) continue;
      else {
          if (this.formSeries.get(`doc${i}`).value) {
              //Si de la linea que recorremos, tiene documento seleccionado aunque sea
              console.log(this.degreesList[i])
              console.log(degreeValue)
              console.log(this.degreesList[i].indexOf(degreeValue))
              if (this.degreesList[i].indexOf(degreeValue)!=-1) {
                  //Si el documento recorrido posee ese grado
                  this.formSeries.get(`degree${i}`).setValue(degreeValue, { emitEvent: false });
                  this.makeYearList(i, degreeValue);
                  if (this.yearsList[i].indexOf(yearValue)!=-1) {
                      //Si el grado seleccionado posee ese año
                      this.formSeries.get(`year${i}`).setValue(yearValue, { emitEvent: false });
                  }else{
                      this.formSeries.get(`year${i}`).setValue(null, { emitEvent: false });
                  }
              }
          }
      }
  }
}

changeDeoc(i, value) {
  this.borraGrafica.emit(1);

  this.dynamicSeries[i].docs = value;

  this.resetDegree(i);
  this.resetYear(i);

  const info = this.xlsData[value];

  const xlsDataKey = Object.keys(info);
  const degreData = Object.values(xlsDataKey);
  const listAux = [];

  for (let j = 0; j < degreData.length; j++) {
      listAux.push(degreData[j]);
  }
  this.degreesList[i] = listAux;
  if(this.formSeries.get(`doc${(i-1)}`)?.value){
      this.fillSerie(i-1);
  }
}

makeEquality(i){
  let serieActual = this.dynamicSeries[i];
  for(let serie of this.dynamicSeries){
    serie.degrees = serieActual.degrees;
    serie.years = serieActual.years;
  }
}

changeDegree(i, value) {
  this.borraGrafica.emit(1);

  this.dynamicSeries[i].degrees = value;
  this.formSeries.get(`year${i}`).reset();
  this.makeYearList(i, value);
  this.fillSerie(i);
}

makeYearList(i, value) {
  var info = this.xlsData[this.formSeries.get(`doc${i}`).value];
  var data = info[value].data;
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

changeYear(i, value) {
  this.borraGrafica.emit(1);

  this.dynamicSeries[i].years = value;
  var info = this.xlsData[this.formSeries.get(`doc${i}`).value];
  var selectedInfo = info[this.formSeries.get(`degree${i}`).value].data.filter(row => (row.asig_curso == value));;

  var semesterDuplicates = []
  Object.keys(selectedInfo).forEach(key => {
      semesterDuplicates.push(selectedInfo[key].asig_vp);
  });
  this.fillSerie(i);
}

resetDegree(i) {
  this.formSeries.get(`degree${i}`).reset(null, { emitEvent: false });
  this.degreesList[i] = [];
}

resetYear(i) {
  this.formSeries.get(`year${i}`).reset(null, { emitEvent: false });
  this.yearsList[i] = [];
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

          var groupInfo;
          groupInfo = {
            name: this.dynamicSeries[i].docs,
            value: sumaGrupo
          }
          
          //si existe la serie
          if (dataSerie[z]?.series){
            dataSerie[z]?.series.push(groupInfo)
          }else{
            dataSerie[z] = {
              name: description[z],
              series: [groupInfo]
            }
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

}
