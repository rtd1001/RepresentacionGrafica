import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { XlsDataService } from '../services/xls-data.service';
import * as XLSX from 'xlsx';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    actualFile: File;

    /*** Información final excel */
    xlsData = {};
    fileNameDiv: any;

    listadoFicheros: Array<File> = [];

    formularioExcel: FormGroup;

    /** Atributo para controlar el mostrar el spinner cargando o no */
    cargando: boolean = false;

    constructor(private router: Router, private _xlsData: XlsDataService) {


    }

    ngOnInit(): void {
        this.formularioExcel = new FormGroup({
            excel: new FormControl()
        });
        this.fileNameDiv = document.querySelector("#fileName");
    }

    onFileSelected(event) {
        //Subimos un fichero, mostramos spinner
        this.cargando = true;
        const file = event.target.files[0];
        //Comprobamos la validación y lo sumamos
        if (!this.validateFileExtension(file)) {
            this.leeYSumaFichero(file);
        }

    }

    /**
     * Función que comprueba que la extensión del fichero subido sea excel. 
     * @returns True si es erroneo
     */
    validateFileExtension(file: File): boolean {
        const fileName: string = file.name;

        let ext: string = fileName.split('.').pop();
        ext = ext.toLowerCase();

        if (ext != 'xls') {
            this.cargando = false;
            this.formularioExcel.reset();
            alert('El archivo ' + fileName + ' no tiene la extensión adecuada. Vuelva a introducir otro archivo.');
            return true;
        } else {
            return false;
        }
    }

    /** Lógica para sumar el fichero a nuestro array de ficheros */
    leeYSumaFichero(file: File) {
        const readerAux = this.readFile(file);
        readerAux.readAsBinaryString(file);
        this.listadoFicheros.push(file);
    }

    //Función para leer y parsear cada uno de los archivos
    readFile(currentFile: File) {
        let worksheet;
        const reader = new FileReader();

        reader.onload = (event) => {
            const data = event.target.result;

            const workbook = XLSX.read(data, {
                type: "string"
            });
            //console.log(workbook)
            const sheet_name_list = workbook.SheetNames;
            worksheet = workbook.Sheets[sheet_name_list[0]];

            const xlsDataAux = this.readWorksheet(worksheet);
            this.cargando = false;

            //Almaceno los archivos parseados
            this.xlsData[currentFile.name] = xlsDataAux;
        };

        return reader;
    }

    borraFichero(file: File) {
        delete this.xlsData[file.name];
        this.listadoFicheros.splice(this.listadoFicheros.indexOf(file), 1);
    }

    sendData() {
        this._xlsData.setXlsData(this.xlsData);
        this.router.navigate(['details'])
    }

    /** Función para parsear un fichero excel */
    readWorksheet(worksheet) {

        var degrees = {};

        //Empiezo en la línea 2 para saltar el encabezado de la hoja de cálculo.
        var C = 0;
        var R = 2;

        //Mientras no sea final del archivo, voy obteniendo los datos relativos a cada grado.
        var eof = false;
        while (!eof) {

            //Si se corresponde con el nombre del grado, creo la estructura de dicho grado.
            var degreeName = worksheet[XLSX.utils.encode_cell({ c: C, r: R })];
            if (degreeName.t != 'n') {

                degreeName = worksheet[XLSX.utils.encode_cell({ c: C, r: R })].v;
                var degree: { [k: string]: any } = {};
                degree = {
                    name: degreeName,
                    data: []
                };

                degrees[degree.name] = degree;

                //Me salto la cabecera que corresponde al grado.
                R += 4;
            }

            //Mientras no sea final del archivo o final de los datos del grado en el que me encuentro, leo los datos.
            let eodegree = false;
            while (!eodegree && !eof) {
                //var degreeRow = {};
                var degreeRow: { [k: string]: any } = {};
                //Compruebo que la celda no esté vacía y almaceno el dato en la estructura creada para los datos de los grados.
                const nombresCeldas: string[] = ['asig_codigo', 'asig_descripcion', 'asig_curso', 'asig_grupo', 'asig_tipAcademica', 'asig_activ', 'asig_tp', 'asig_vp', 'asig_turno'
                    , 'alum_maxPropios_rep', 'alum_maxPropios_noRep', 'alum_matriculados_rep', 'alum_matriculados_noRep', 'alum_propios_max', 'alum_propios_exce', 'alum_propios_asig'
                    , 'alum_propios_disp', 'alum_externos_max', 'alum_externos_asig', 'alum_externos_disp', 'alum_progInter', 'alum_total', 'critAs_codigo',
                    'critAs_descripcion', 'critAs_asigAlfb_desde', 'critAs_asigAlfb_hasta', 'prof_pf', 'prof_niu', 'prof_nombreyapellidos', 'prof_cds', 'prof_actas', 'prof_docencia', 'prof_responsable'];

                if (worksheet[XLSX.utils.encode_cell({ c: C, r: R })]) degreeRow.asig_codigo = worksheet[XLSX.utils.encode_cell({ c: C, r: R })].v;

                for (const nombreCelda of nombresCeldas) {
                    if (worksheet[XLSX.utils.encode_cell({ c: ++C, r: R })]) {
                        degreeRow[nombreCelda] = worksheet[XLSX.utils.encode_cell({ c: C, r: R })].v;
                    }
                }

                degree.data.push(degreeRow);

                //Reseteo las filas y columnas, aumento la fila y la columna vuelve a 0 para empezar de nuevo.
                R += 1;
                C = 0;

                //Verifico las condiciones de los 'while'
                const nextDegreeRow = worksheet[XLSX.utils.encode_cell({ c: C, r: R })];
                if (!nextDegreeRow) {
                    eof = true;
                } else if (nextDegreeRow.t === 's') {
                    eodegree = true;
                }

            }

        }

        let degreesOK = this.removeDuplicates(degrees);
        return degreesOK;
    }


    /*Función para eliminar filas duplicadas
      (si es la misma asignatura y mismo grupo está duplicada,
      pues se trata de una asignatura con profesores distintos)*/
    removeDuplicates(degrees) {

        let dataAux;
        const keys: string[] = Object.keys(degrees);

        //recorre el objeto con la información de los grados
        for (let i = 0; i < keys.length; i++) {

            let key = keys[i];
            dataAux = degrees[key].data;
            for (let j = 0; j < dataAux.length - 1; j++) {

                //Si tienen mismo codigo y grupo, las marco(está repetida)
                if (dataAux[j].asig_codigo === dataAux[j + 1].asig_codigo
                    && dataAux[j].asig_grupo === dataAux[j + 1].asig_grupo) {
                    dataAux[j] = "";
                }

            }

            //Filtro aquelllas filas que he marcado y las elimino de mi objeto
            dataAux = dataAux.filter(row => (row + "").trim());
            degrees[key].data = dataAux;
        }

        return degrees;
    }


}
