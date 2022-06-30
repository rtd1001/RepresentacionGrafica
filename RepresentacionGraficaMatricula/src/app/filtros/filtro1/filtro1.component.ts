import { ListKeyManager } from '@angular/cdk/a11y';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Series } from 'src/app/series';
import { XlsDataService } from 'src/app/services/xls-data.service';

@Component({
  selector: 'app-filtro1',
  templateUrl: './filtro1.component.html',
  styleUrls: ['./filtro1.component.css']
})
export class Filtro1Component implements OnInit {

  dynamicSeries: Array<Series> = [];
  dynamicAux: any = {};
  xlsData: any[];

  degreesList = {}
    yearsList = {}
    semestersList = {}
    docsList = []

  selectedDoc: any = '';
  selectedDegree: any = '';
  selectedYear: any = '';
  selectedSemester: any = '';

  @Output()borraGrafica:EventEmitter<number>=new EventEmitter();

  constructor(
    private _xlsData: XlsDataService
  ) { }

  ngOnInit(): void {
    this.dynamicAux = { degrees: "", years: "", semesters: "" };
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
    this.dynamicAux = { docs: "", degrees: "", years: "", semesters: "" };
    this.dynamicSeries.push(this.dynamicAux);
    return true;
}


  changeDoc(value, i) {
    this.borraGrafica.emit(1);
    this.selectedDoc = value;
    this.dynamicSeries[i].docs = this.selectedDoc;

    this.resetDegree(i);
    this.resetYear(i);
    this.resetSemester(i);
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
    this.resetSemester(i);

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

    this.resetSemester(i);

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
    this.semestersList[i] = listAux;

}

changeSemester(value, i) {
  this.borraGrafica.emit(1);
    this.selectedSemester = value;
    this.dynamicSeries[i].semesters = this.selectedSemester;

}

resetDegree(i) {
    this.dynamicSeries[i].degrees = "";
}

resetYear(i) {
    this.dynamicSeries[i].years = "";
}

resetSemester(i) {
    this.dynamicSeries[i].semesters = "";
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
/*
    var maxAverage = 0;
    for (var i = 0; i < this.dynamicSeries.length; i++) {
        var descriptionArray = [];

        var data = this.xlsData[this.dynamicSeries[i].docs];
        var info = data[this.dynamicSeries[i].degrees].data.filter(row => (
            row.asig_curso == this.dynamicSeries[i].years
            && row.asig_vp == this.dynamicSeries[i].semesters
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
        var total = 0;
        var groupInfo = [];
        var maxGroup = 0;
        for (var j = 0; j < groups.length; j++) {

            var info_group = info.filter(row => row.asig_grupo == groups[j])

            var totalEachGroup = []
            Object.keys(info_group).forEach(key => {

                total += info_group[key].alum_total;
                totalEachGroup.push(info_group[key].alum_total)

            });


            maxGroup += Math.max.apply(null, totalEachGroup);

            groupInfo[j] = {
                x: "Grupo" + groups[j],
                y: totalEachGroup
            }


        }
        console.log(groupInfo)

        var average = 0;
        average = total / description.length;

        if (average > maxAverage) {
            maxAverage = average;
        }



        dataSerie[i] = {
            x: this.dynamicSeries[i].degrees + '-' + this.dynamicSeries[i].years + '-' + this.dynamicSeries[i].semesters,
            y: average,
            maxY: maxAverage,
            chartInfo: groupInfo,
            des: descriptionArray,
            maxY_group: maxGroup
        }

    }*/

    var descriptionArray = [];
    var maxAverage = 0;
    var data = this.xlsData[this.selectedDoc];

    var info = data[this.selectedDegree].data.filter(row => (
        row.asig_curso == this.selectedYear
        && row.asig_vp == this.selectedSemester
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

    var total = 0;
    var groupInfo = [];
    var maxGroup = 0;
    //var sumaGrupos: number[] = [];
    var sumaGrupos = {};
    var valorGrupos = [];
    for (var j = 0; j < groups.length; j++) {

        var info_group = info.filter(row => row.asig_grupo == groups[j])
        console.log('info_group')
        console.log(info_group)
        var totalEachGroup = []
        var z = 0;
        var aux = 0;
        var ar2 = [];
        ar2.push(0)
        var ar1 = [];
        Object.keys(info_group).forEach(key => {
            
          //  var aux = 0
            //Array con la suma de alumnos de cada grupo. Las posiciones son las asignaturas.
          /*  console.log(info_group[key].alum_total)
            aux = sumaGrupos[key]
            console.log(aux)
            aux = aux + info_group[key].alum_total;
            sumaGrupos[key] = aux;
           // aux = sumaGrupos[key];*/
            
            ar1.push(Number(info_group[key].alum_total));
            var sum = ar1.map((num, idx) => num + ar2[idx]);
            console.log('sum',sum)
            ar2.push(sum)

            totalEachGroup.push(info_group[key].alum_total)
            console.log(totalEachGroup);
            console.log("totalEachGroup");
           
             if (z < groups.length) {
                totalEachGroup[z] = {
                    n: "Grupo" + groups[z],
                    v: info_group[key].alum_total
                } 
                z++; 
            }
        });
    }
    /*
    for(var f = 0; f < description.length; f++){
        for (var j = 0; j < groups.length; j++) {
            var info_group = info.filter(row => row.asig_grupo == groups[j])
            console.log(info_group)
            sumaGrupos[f] += info_group[f].alum_total;
            console.log("sumagrupos")
            console.log(sumaGrupos);

        }


    }
    */
   /* groupInfo[key] = {
        x: info_group[key].asig_descripcion,
        y: totalEachGroup
    }    */

    //console.log("groupInfo")
    //console.log(groupInfo)

    var average = 0;
    average = total / description.length;

    if (average > maxAverage) {
        maxAverage = average;
    }
    
    for(var f = 0; f < description.length; f++){
       dataSerie[f] = {
        x: description[f],
        y: sumaGrupos[f]
       }


    }

    console.log('dataserie')
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
  }
  
}

}
