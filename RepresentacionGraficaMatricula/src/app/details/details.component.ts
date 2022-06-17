import { Component, OnInit, ResolvedReflectiveFactory, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { XlsDataService } from '../services/xls-data.service';
import { Series } from '../series';

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
import { FormControl, FormGroup } from '@angular/forms';
import { FiltroGraficasService } from '../services/filtroGraficas.service';

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

    /** Formulario de selección de gráfico */
    formularioGrafico: FormGroup;
    /** Formulario de reglas */
    formularioRegla: FormGroup;
    /** Tipo de gráfico seleccionado */
    tipoGrafico: string;
    informacionGraficosAMostrar: any[];

    @ViewChild("chart") chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;
    public chartInfoOptions: Partial<ChartOptions>;

    xlsData: any[];

    constructor(
        private router: Router,
        private _xlsData: XlsDataService,
        private filtroGraficaService: FiltroGraficasService
    ) { }

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

    //description: any = [];

    ngOnInit(): void {

        this.dynamicAux = { degrees: "", years: "", semesters: "" };
        this.dynamicSeries.push(this.dynamicAux);


        //Obtengo el excel y saco el listado de documentos
        this.xlsData = this._xlsData.getXlsData();
        this.docsList = this.getDocs();
        console.log(this.xlsData)
        console.log(this.docsList)

        //Iniciamos formulario
        this.formularioGrafico = new FormGroup({
            graficoSeleccionado: new FormControl()
        });


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
        this.informacionGraficosAMostrar = null;
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
        this.informacionGraficosAMostrar = null;
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
        this.informacionGraficosAMostrar = null;
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
        this.informacionGraficosAMostrar = null;
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



    /** Una vez que ha elegido un gráfico, podemos crearlo */
    createChart() {
        this.informacionGraficosAMostrar = null;
        const graficoSeleccionado: string = this.formularioGrafico.get('graficoSeleccionado').value
        if (!graficoSeleccionado) {
            alert('No ha seleccionado una gráfica. Seleccione la gráfica que desea.');
        } else {
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
            } else {
                switch (graficoSeleccionado) {
                    case '1':
                        this.tipoGrafico = 'vertical';
                        this.selectedChart = Number(graficoSeleccionado);
                        this.informacionGraficosAMostrar = this.makeData();
                        console.log(this.informacionGraficosAMostrar)
                        break;
                    case '2':
                        break;
                }
            }
        }



    }





    makeData(): any {

        var dataSerie = [];

        var maxAverage = 0;
        for (var i = 0; i < this.dynamicSeries.length; i++) {
            var descriptionArray = [];

            var data = this.xlsData[this.dynamicSeries[i].docs];
            var info = data[this.dynamicSeries[i].degrees].data.filter(row => (
                row.asig_curso == this.dynamicSeries[i].years
                && row.asig_vp == this.dynamicSeries[i].semesters
                && row.asig_grupo == 'Teoría'
                && row.asig_activ == 'S'));
            var groupsDuplicates = [];
            var descriptionDuplicates = [];
            Object.keys(info).forEach(key => {
                groupsDuplicates.push(info[key].asig_grupo);
                descriptionDuplicates.push(info[key].asig_descripcion);
            });

            var groups = Array.from(new Set(groupsDuplicates));
            var description = Array.from(new Set(descriptionDuplicates));
            descriptionArray.push(description);

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

            var average = 0;
            average = total / description.length;

            if (average > maxAverage) {
                maxAverage = average;
            }

            dataSerie[i] = {
                x: this.dynamicSeries[i].degrees + '-' + this.dynamicSeries[i].years + '-' + this.dynamicSeries[i].semesters,
                y: average,
                color: colors[i],
                maxY: maxAverage,
                chartInfo: groupInfo,
                des: descriptionArray,
                maxY_group: maxGroup
            }

        }
        return dataSerie;
    }



}
