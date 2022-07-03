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

            //Obtengo la informacion del doc seleccionado
            var data = this.xlsData[this.selectedDoc];
            //Se filtra la informacion segun lo seleccionado
            var info = data[this.selectedDegree].data.filter(row => (
                row.asig_curso == this.selectedYear
                && row.asig_vp == this.selectedSemester
                && row.asig_tipAcademica == 'Teoría'
                && row.asig_activ == 'S'));

            //Se obtiene array de grupos y descripciones
            var groupsDuplicates = [];
            var descriptionDuplicates = [];
            Object.keys(info).forEach(key => {
                groupsDuplicates.push(info[key].asig_grupo);
                descriptionDuplicates.push(info[key].asig_descripcion);
            });

            var groups = Array.from(new Set(groupsDuplicates));
            var description = Array.from(new Set(descriptionDuplicates));

            for (var z = 0; z < description.length; z++){

                var info_description = info.filter(row => row.asig_descripcion == description[z])
                
                var seriesAux = [];
                for (var j = 0; j < groups.length; j++) {

                    var info_group = info_description.filter(row => row.asig_grupo == groups[j])
                    
                    Object.keys(info_group).forEach(key => {

                        //Se obtiene el numero de matriculados de cada Grupo
                        var totalCadaGrupo = 0;
                        totalCadaGrupo = info_group[key].alum_total;

                        //Se añade el grupo y numero a la serie
                        seriesAux.push({
                            name: "Grupo" + groups[j],
                            value: totalCadaGrupo
                        });
                    });
                    
                }

                dataSerie[z] = {
                    name: description[z],
                    series: seriesAux
                }
            }

            return dataSerie;
        }
    
    }

}
