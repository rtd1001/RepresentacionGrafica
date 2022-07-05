import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-graf-vertical',
    templateUrl: './graf-vertical.component.html',
    styleUrls: ['./graf-vertical.component.css']
})
export class GrafVerticalComponent implements OnInit {


    datosGrafico: any[] = [];
    ticks = [];

    @Input() datos: any[];

    graficoInfoAdicional: any[];
    series: any[];

    infoSeleccionada;

    constructor() {
    }

    ngOnInit(): void {
        console.log('datos 1')
        console.log(this.datosGrafico)
       /* for (const dato of this.datos) {
            this.datosGrafico.push({ name: dato.x, value: dato.y });
        }*/

        const datosLimpios = [];
        for (const dato of this.datos) {
            if (dato) datosLimpios.push(dato);
        }
        this.datosGrafico = datosLimpios;

        console.log(this.datosGrafico);

        let maximo = 0;
        for (let dato of this.datosGrafico){
            let sumSerie = 0;
            for(let serie of dato.series){
                sumSerie += serie.value;
                
            }
            if (sumSerie > maximo){
                maximo = sumSerie;
            }
        }

        let redondeo = 0;
        redondeo = Math.ceil(maximo/25)*25
        
        for (let i = 0; i <= redondeo; i++){
            if ( i % 25 == 0){
                this.ticks.push(i);
            }
        }
        if( this.ticks.length == 1){
            this.ticks.push(25);
        }
        console.log(this.ticks)
    }



}
