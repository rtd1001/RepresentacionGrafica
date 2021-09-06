import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { XlsDataService } from '../services/xls-data.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  fileList = [];
  actualFile : File;
  //worksheet: any[];
  //xlsData: any[] = [];
  xlsData = {};
  isValid = false;
  fileNameDiv:any;
  constructor(private router: Router, private _xlsData: XlsDataService) {

   }

  ngOnInit(): void {
		this.fileNameDiv = document.querySelector("#fileName");
  }

  onFileSelected(event) {
    this.isValid = false;
    var files =  event.target.files;
    this.actualFile =files[0];
    /*
    this.fileList = event.target.files;
    
    for(var i = 0; i < this.fileList.length; i++){
      var currentFile = this.fileList[i];
      //this.fileName.push(fileList[i]);
      this.validateFileExtension(currentFile);
    }*/
    this.validateFileExtension();

    //this.fileNameDiv.innerHTML = "";
    this.fileNameDiv.innerHTML += this.actualFile.name + "<br/>" + "<hr/>";

    this.sendFile();
  }

  //Función para compprobar que la extensión del archivo/s sea la correcta
  validateFileExtension(){
    var fileName = this.actualFile.name;
    console.log(fileName)

    var ext = fileName.split('.').pop();
    ext = ext.toLowerCase();

    if(ext != 'xls'){
      alert('El archivo ' + fileName +  ' no tiene la extensión adecuada. Vuelva a introducir otro archivo.');
      //fileBtn.value = ''; 
      var fileInput = document.getElementById("fileInput");
      fileInput.nodeValue='';
    }
  }

  sendFile(){
    /*
    var fileListRead = [];
    console.log(this.fileList)
    if(this.fileList != null){
      for(var i = 0; i < this.fileList.length; i++){

        var currentFile =this.fileList[i];
        console.log(currentFile);
        var readerAux;
        readerAux = this.readFile(currentFile);
        
        readerAux.readAsBinaryString(this.fileList[i]);
        
        fileListRead.push(readerAux);
        
      }
    }
    */

    if(this.actualFile != null){
      
      var readerAux;
      readerAux = this.readFile(this.actualFile);
      
      readerAux.readAsBinaryString(this.actualFile);
      
      this.fileList.push(readerAux);
        
    }    
  }

   //Función para leer y parsear cada uno de los archivos
  readFile(currentFile){
    var worksheet;
    //var xlsData = [];
    var reader = new FileReader();
    console.log(reader)

    reader.onload = (event) => {
      var data = event.target.result;
      
      var workbook = XLSX.read(data, {
        type: "string"
      });
      //console.log(workbook)
      var sheet_name_list = workbook.SheetNames;
      worksheet = workbook.Sheets[sheet_name_list[0]];
      
      var xlsDataAux;
      xlsDataAux = this.readWorksheet(worksheet);
      this.isValid = true;

      //Almaceno los archivos parseados
      this.xlsData[currentFile.name] = xlsDataAux;
      //this.xlsData.push(xlsDataAux);
      this._xlsData.setXlsData(this.xlsData);
      console.log(this.xlsData)
      /*if( worksheet[XLSX.utils.encode_cell({c:0, r:0})] === undefined ){
        alert('Ha introducido un archivo vacío. Vuelva a introducir otro archivo.');
        fileBtn.value = ''; 
      }*/
    };
    
    return reader;
  }

  //Función para parsear el archivo
  readWorksheet(worksheet){
          
    var degrees = {};

    //Empiezo en la línea 2 para saltar el encabezado de la hoja de cálculo.
    var C = 0;
    var R = 2;
    
    //Mientras no sea final del archivo, voy obteniendo los datos relativos a cada grado.
    var eof = false;
    while(!eof){
      
      //Si se corresponde con el nombre del grado, creo la estructura de dicho grado.
      var degreeName = worksheet[XLSX.utils.encode_cell({c:C, r:R})];
      if( degreeName.t != 'n' ){

        degreeName = worksheet[XLSX.utils.encode_cell({c:C, r:R})].v;
        var degree: {[k: string]: any} = {};
        degree = {
          name: degreeName, 
          data:[]
        };

        degrees[degree.name]=degree;
        
        //Me salto la cabecera que corresponde al grado.
        R += 4;
      }
      
      //Mientras no sea final del archivo o final de los datos del grado en el que me encuentro, leo los datos.
      var eodegree = false;
      while( !eodegree && !eof){
        //var degreeRow = {};
        var degreeRow: {[k: string]: any} = {};
        //Compruebo que la celda no esté vacía y almaceno el dato en la estructura creada para los datos de los grados.
        if(worksheet[XLSX.utils.encode_cell({c:C, r:R})])   degreeRow.asig_codigo = worksheet[XLSX.utils.encode_cell({c:C, r:R})].v;
        if(worksheet[XLSX.utils.encode_cell({c:++C, r:R})]) degreeRow.asig_descripcion = worksheet[XLSX.utils.encode_cell({c:C, r:R})].v;
        if(worksheet[XLSX.utils.encode_cell({c:++C, r:R})]) degreeRow.asig_curso = worksheet[XLSX.utils.encode_cell({c:C, r:R})].v;
        if(worksheet[XLSX.utils.encode_cell({c:++C, r:R})]) degreeRow.asig_grupo = worksheet[XLSX.utils.encode_cell({c:C, r:R})].v;
        if(worksheet[XLSX.utils.encode_cell({c:++C, r:R})]) degreeRow.asig_tipAcademica = worksheet[XLSX.utils.encode_cell({c:C, r:R})].v;
        if(worksheet[XLSX.utils.encode_cell({c:++C, r:R})]) degreeRow.asig_activ = worksheet[XLSX.utils.encode_cell({c:C, r:R})].v;
        if(worksheet[XLSX.utils.encode_cell({c:++C, r:R})]) degreeRow.asig_tp = worksheet[XLSX.utils.encode_cell({c:C, r:R})].v;
        if(worksheet[XLSX.utils.encode_cell({c:++C, r:R})]) degreeRow.asig_vp = worksheet[XLSX.utils.encode_cell({c:C, r:R})].v;
        if(worksheet[XLSX.utils.encode_cell({c:++C, r:R})]) degreeRow.asig_turno = worksheet[XLSX.utils.encode_cell({c:C, r:R})].v;

        if(worksheet[XLSX.utils.encode_cell({c:++C, r:R})]) degreeRow.alum_maxPropios_rep = worksheet[XLSX.utils.encode_cell({c:C, r:R})].v;
        if(worksheet[XLSX.utils.encode_cell({c:++C, r:R})]) degreeRow.alum_maxPropios_noRep = worksheet[XLSX.utils.encode_cell({c:C, r:R})].v;
        if(worksheet[XLSX.utils.encode_cell({c:++C, r:R})]) degreeRow.alum_matriculados_rep = worksheet[XLSX.utils.encode_cell({c:C, r:R})].v;
        if(worksheet[XLSX.utils.encode_cell({c:++C, r:R})]) degreeRow.alum_matriculados_noRep = worksheet[XLSX.utils.encode_cell({c:C, r:R})].v;
        if(worksheet[XLSX.utils.encode_cell({c:++C, r:R})]) degreeRow.alum_propios_max = worksheet[XLSX.utils.encode_cell({c:C, r:R})].v;
        if(worksheet[XLSX.utils.encode_cell({c:++C, r:R})]) degreeRow.alum_propios_exce = worksheet[XLSX.utils.encode_cell({c:C, r:R})].v;
        if(worksheet[XLSX.utils.encode_cell({c:++C, r:R})]) degreeRow.alum_propios_asig = worksheet[XLSX.utils.encode_cell({c:C, r:R})].v;
        if(worksheet[XLSX.utils.encode_cell({c:++C, r:R})]) degreeRow.alum_propios_disp = worksheet[XLSX.utils.encode_cell({c:C, r:R})].v;
        if(worksheet[XLSX.utils.encode_cell({c:++C, r:R})]) degreeRow.alum_externos_max = worksheet[XLSX.utils.encode_cell({c:C, r:R})].v;
        if(worksheet[XLSX.utils.encode_cell({c:++C, r:R})]) degreeRow.alum_externos_asig = worksheet[XLSX.utils.encode_cell({c:C, r:R})].v;
        if(worksheet[XLSX.utils.encode_cell({c:++C, r:R})]) degreeRow.alum_externos_disp = worksheet[XLSX.utils.encode_cell({c:C, r:R})].v;
        if(worksheet[XLSX.utils.encode_cell({c:++C, r:R})]) degreeRow.alum_progInter = worksheet[XLSX.utils.encode_cell({c:C, r:R})].v;
        if(worksheet[XLSX.utils.encode_cell({c:++C, r:R})]) degreeRow.alum_total = worksheet[XLSX.utils.encode_cell({c:C, r:R})].v;
        
        if(worksheet[XLSX.utils.encode_cell({c:++C, r:R})]) degreeRow.critAs_codigo = worksheet[XLSX.utils.encode_cell({c:C, r:R})].v;
        if(worksheet[XLSX.utils.encode_cell({c:++C, r:R})]) degreeRow.critAs_descripcion = worksheet[XLSX.utils.encode_cell({c:C, r:R})].v;
        if(worksheet[XLSX.utils.encode_cell({c:++C, r:R})]) degreeRow.critAs_asigAlfb_desde = worksheet[XLSX.utils.encode_cell({c:C, r:R})].v;
        if(worksheet[XLSX.utils.encode_cell({c:++C, r:R})]) degreeRow.critAs_asigAlfb_hasta = worksheet[XLSX.utils.encode_cell({c:C, r:R})].v;

        if(worksheet[XLSX.utils.encode_cell({c:++C, r:R})]) degreeRow.prof_pf = worksheet[XLSX.utils.encode_cell({c:C, r:R})].v;
        if(worksheet[XLSX.utils.encode_cell({c:++C, r:R})]) degreeRow.prof_niu = worksheet[XLSX.utils.encode_cell({c:C, r:R})].v;
        if(worksheet[XLSX.utils.encode_cell({c:++C, r:R})]) degreeRow.prof_nombreyapellidos = worksheet[XLSX.utils.encode_cell({c:C, r:R})].v;
        if(worksheet[XLSX.utils.encode_cell({c:++C, r:R})]) degreeRow.prof_cds = worksheet[XLSX.utils.encode_cell({c:C, r:R})].v;
        if(worksheet[XLSX.utils.encode_cell({c:++C, r:R})]) degreeRow.prof_actas = worksheet[XLSX.utils.encode_cell({c:C, r:R})].v;
        if(worksheet[XLSX.utils.encode_cell({c:++C, r:R})]) degreeRow.prof_docencia = worksheet[XLSX.utils.encode_cell({c:C, r:R})].v;
        if(worksheet[XLSX.utils.encode_cell({c:++C, r:R})]) degreeRow.prof_responsable = worksheet[XLSX.utils.encode_cell({c:C, r:R})].v;
        
        degree.data.push(degreeRow);

        //Reseteo las filas y columnas, aumento la fila y la columna vuelve a 0 para empezar de nuevo.
        R += 1;
        C = 0;

        //Verifico las condiciones de los 'while'
        var nextDegreeRow = worksheet[XLSX.utils.encode_cell({c:C, r:R})];
        if( !nextDegreeRow ){
          eof=true;
        }else if( nextDegreeRow.t === 's' ){
          eodegree=true;
        }
        
      }
      //console.log(degrees.name)
      
    }

    var degreesOK;
    degreesOK = this.removeDuplicates(degrees);
    console.log(degreesOK)
    return degreesOK;
  }


  /*Función para eliminar filas duplicadas
    (si es la misma asignatura y mismo grupo está duplicada,
    pues se trata de una asignatura con profesores distintos)*/
  removeDuplicates(degrees){

    var dataAux; 
    var keys = Object.keys(degrees);

    //recorre el objeto con la información de los grados
    for(var i = 0; i < keys.length; i++){
      
      var key = keys[i];
      dataAux = degrees[key].data;
      for(var j = 0; j < dataAux.length-1;j++){

        //Si tienen mismo codigo y grupo, las marco(está repetida)
        if(dataAux[j].asig_codigo === dataAux[j+1].asig_codigo
          && dataAux[j].asig_grupo === dataAux[j+1].asig_grupo){
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
