import { ListKeyManager } from '@angular/cdk/a11y';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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

    degreesList = []
    yearsList = []
    semestersList = []
    docsList = []

    selectedDoc: any = '';
    selectedDegree: any = '';
    selectedYear: any = '';
    selectedSemester: any = '';

    @Output()borraGrafica:EventEmitter<number>=new EventEmitter();

    formSeries: FormGroup = new FormGroup({});

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
            this.formSeries.addControl(`semester${i}`, new FormControl());
            this.formSeries.get(`doc${i}`).valueChanges.subscribe(doc => {
                this.changeDoc(i, doc);
            })
            this.formSeries.get(`degree${i}`).valueChanges.subscribe(degree => {
                this.changeDegree(i, degree);
            })
            this.formSeries.get(`year${i}`).valueChanges.subscribe(year => {
                this.changeYear(i, year);
            })
            this.formSeries.get(`semester${i}`).valueChanges.subscribe(semester => {
                this.changeSemester(i, semester);
            })
            this.dynamicSeries.push({ docs: "", degrees: "", years: "", semesters: "" });
        } else {
            alert('Limite de series alcanzado')
        }
    }


    changeDoc(i, value) {
        this.borraGrafica.emit(1);

        this.dynamicSeries[i].docs = value;

        this.resetDegree(i);
        this.resetYear(i);
        this.resetSemester(i);
        const info = this.xlsData[value];

        const xlsDataKey = Object.keys(info);
        const degreData = Object.values(xlsDataKey);
        const listAux = [];
        for (let j = 0; j < degreData.length; j++) {
            listAux.push(degreData[j]);
        }
        this.degreesList[i] = listAux;

    }

    changeDegree(i, value) {
        this.borraGrafica.emit(1);

        this.dynamicSeries[i].degrees = value;
        this.formSeries.get(`semester${i}`).reset();
        this.formSeries.get(`year${i}`).reset();

        this.makeYearList(i, value);
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
        var semester = Array.from(new Set(semesterDuplicates))
        var listAux = []
        for (var z = 0; z < semester.length; z++) {
            listAux.push(semester[z]);
        }
        this.semestersList[i] = listAux;

    }

    changeSemester(i, value) {
        this.borraGrafica.emit(1);

        this.dynamicSeries[i].semesters = value;

    }

    resetDegree(i) {
        this.formSeries.get(`degree${i}`).reset(null, { emitEvent: false });
        this.degreesList[i] = [];
    }

    resetYear(i) {
        this.formSeries.get(`year${i}`).reset(null, { emitEvent: false });
        this.yearsList[i] = [];
    }

    resetSemester(i) {
        this.formSeries.get(`semester${i}`).reset(null, { emitEvent: false });
        this.semestersList[i] = [];
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
            var data = this.xlsData[this.formSeries.get('doc0').value];
            //Se filtra la informacion segun lo seleccionado
            var info = data[this.formSeries.get('degree0').value].data.filter(row => (
                row.asig_curso == this.formSeries.get('year0').value
                && row.asig_vp == this.formSeries.get('semester0').value
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
