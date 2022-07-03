import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
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
    private _xlsData: XlsDataService,
    private cdref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.dynamicAux = { degrees: "", years: "" };
    this.dynamicSeries.push(this.dynamicAux);


    //Obtengo el excel y saco el listado de documentos
    this.xlsData = this._xlsData.getXlsData();
    this.docsList = this.getDocs();

  }

  ngAfterViewInit(){
    this.cdref.detectChanges();
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

changeDegree(select, i) {
  this.borraGrafica.emit(1);
  let error;
  let value = select.value;
  for(let serie of this.dynamicSeries){
    let degree = serie.degrees;
    if(degree){
      if(degree != value){
        error = true;
        alert("Se debe seleccionar el mismo grado/master.")
        select.control.reset();
      }
    }
  }
  if(!error){
    this.selectedDegree = value;
    this.dynamicSeries[i].degrees = this.selectedDegree;

    this.resetYear(i);

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
}

changeYear(select, i) {
this.borraGrafica.emit(1);
  let error;
  let value = select.value;
  for(let serie of this.dynamicSeries){
    let year = serie.years;
    if(year){
      if(year != value){
        error = true;
        alert("Se debe seleccionar el mismo curso.")
        select.control.reset();
      }
    }
  }
  if(!error){
    this.selectedYear = value;
    this.dynamicSeries[i].years = this.selectedYear;

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
  }
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
          
        }

      }

      return dataSerie;

    }//else
  }//makeData
  
}//class
