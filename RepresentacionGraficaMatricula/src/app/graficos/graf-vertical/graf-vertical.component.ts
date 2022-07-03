import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-graf-vertical',
    templateUrl: './graf-vertical.component.html',
    styleUrls: ['./graf-vertical.component.css']
})
export class GrafVerticalComponent implements OnInit {


    datosGrafico: any[] = [];

    @Input() datos: any[];

    graficoInfoAdicional: any[];
    series: any[];

    infoSeleccionada;

    constructor() {
    }

    ngOnInit(): void {
        console.log('datos 1')
        console.log(this.datos)
       /* for (const dato of this.datos) {
            this.datosGrafico.push({ name: dato.x, value: dato.y });
        }*/
        this.datosGrafico = this.datos;
        console.log(this.datosGrafico);
    }

 
    /**
     * Evento de selección
     * @param event 
     */
    onSelect(event) {
        const infoSeleccionada = this.datos.find(dato => dato.x === event.name);
        if (this.infoSeleccionada === infoSeleccionada) {
            this.infoSeleccionada = null;
            this.graficoInfoAdicional = null;
        } else {
            this.infoSeleccionada = infoSeleccionada;
            this.graficoInfoAdicional = [];
            let posicion = 1;
            console.log(infoSeleccionada.chartInfo[0])
        /*    for (const valor of infoSeleccionada.chartInfo[0].y) {
                console.log(valor)
                this.graficoInfoAdicional.push({ name: infoSeleccionada.chartInfo[0].x + posicion, value: valor })
                posicion++;
            }*/

            this.series = [];
            for(var i = 0; i < this.infoSeleccionada.des.length; i++){
                for (const valor of infoSeleccionada.chartInfo[0].y) {
                    this.series.push({ name: infoSeleccionada.chartInfo[0].x, value: valor })
                }

                this.graficoInfoAdicional.push({name: infoSeleccionada.des[i], value: this.series})
            }

            console.log(this.graficoInfoAdicional)
        }


    }

}
