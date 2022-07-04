import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Series } from 'src/app/series';
import { XlsDataService } from 'src/app/services/xls-data.service';

@Component({
  selector: 'app-filtro3',
  templateUrl: './filtro3.component.html',
  styleUrls: ['./filtro3.component.css']
})
export class Filtro3Component implements OnInit {

  dynamicSeries: Array<Series> = [];
  dynamicAux: any = {};
  xlsData: any[];

  degreesList = {}
  docsList = []

  selectedDoc: any = '';
  selectedDegree: any = '';

  @Output()borraGrafica:EventEmitter<number>=new EventEmitter();

  constructor(
    private _xlsData: XlsDataService
  ) { }

  ngOnInit(): void {
    this.dynamicAux = { degrees: "" };
    this.dynamicSeries.push(this.dynamicAux);


    //Obtengo el excel y saco el listado de documentos
    this.xlsData = this._xlsData.getXlsData();
    this.docsList = this.getDocs();
  }

  getDocs() {
    const docs = [];
    for (const key of Object.keys(this.xlsData)) {
        docs.push(key);
    }
    return docs;
  }

  changeDoc(value, i) {
    this.borraGrafica.emit(1);
    this.selectedDoc = value;
    this.dynamicSeries[i].docs = this.selectedDoc;
  
    this.resetDegree(i);

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
  
    //this.resetYear(i);
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
    //this.yearsList[i] = listAux;
  }

  resetDegree(i) {
    this.dynamicSeries[i].degrees = "";
  }

  makeData(): any {

    let serieCompleta = true;
        Object.keys(this.dynamicSeries[0]).forEach(key => {
            if (this.dynamicSeries[0][key] === "") {
                serieCompleta = false;
            }
        });
      
  
      if (!serieCompleta) {
          alert('Las series no están completas. Termine de seleccionar las opciones.');
      } else{
  
        var dataSerie = [];
        console.log(this.dynamicSeries.length)
  
          var data = this.xlsData[this.dynamicSeries[0].docs];
          var info = data[this.dynamicSeries[0].degrees].data.filter(row => (
              row.asig_tipAcademica == 'Teoría'
              && row.asig_activ == 'S'));
              console.log('info')   
          console.log(info)
          var groupsDuplicates = [];
          var descriptionDuplicates = [];
          var yearDuplicates = [];
          var semesterDuplicates = [];
          Object.keys(info).forEach(key => {
              groupsDuplicates.push(info[key].asig_grupo);
            //  descriptionDuplicates.push(info[key].asig_descripcion);
             // yearDuplicates.push(info[key].asig_curso);
              yearDuplicates.push(info[key].asig_curso);
              semesterDuplicates.push(info[key].asig_vp);
          });
  
          var groups = Array.from(new Set(groupsDuplicates));
          //var description = Array.from(new Set(descriptionDuplicates));
          var year = Array.from(new Set(yearDuplicates));
          var semester = Array.from(new Set(semesterDuplicates));
          
          console.log('groups')
          console.log(groups)
          console.log('description')
          console.log(description)
          console.log('year')
          console.log(year)
          console.log('semester')
          console.log(semesterDuplicates)

          
          let semesterNum =[]
          let semesterValue = year.length * semester.length;
          console.log(semesterValue)
          for(let s = 1; s <= semesterValue; s++){
            semesterNum.push(s);
          }

          let sNum = 0;
          var series = []
          var sumaGrupo = 0;
          for (var w = 0; w < year.length; w++){

            var info_year = info.filter(row => row.asig_curso == year[w])

            for (var y = 0; y < semester.length; y++){

              var info_semester = info_year.filter(row => row.asig_vp == semester[y])

              var descriptionDuplicates = [];
              Object.keys(info_semester).forEach(key => {
                  descriptionDuplicates.push(info_semester[key].asig_descripcion);
              });
    
              var description = Array.from(new Set(descriptionDuplicates));

              for (var z = 0; z < description.length; z++){

                var info_description = info_semester.filter(row => row.asig_descripcion == description[z])

                let sumaGrupo = 0;
                for (var j = 0; j < groups.length; j++) {
                  
                  var info_group = info_description.filter(row => row.asig_grupo == groups[j])

                  Object.keys(info_group).forEach(key => {
                    sumaGrupo += info_group[key].alum_total;
                  });

                }
                
                var groupInfo;
                groupInfo = {
                name: description[z],
                value: sumaGrupo
                }
                
                //si existe la serie
                if (dataSerie[sNum]?.series){
                  dataSerie[sNum]?.series.push(groupInfo)
                }else{
                  dataSerie[sNum] = {
                    name: 'Semestre ' + semesterNum[sNum],
                    series: [groupInfo]
                  }
                }

              }     
              sNum = sNum + 1;         
            }
            
          }

        

        console.log('dataSerie')
        console.log(dataSerie)
        
        return dataSerie;
  
      }//else
    }//makeData
}
