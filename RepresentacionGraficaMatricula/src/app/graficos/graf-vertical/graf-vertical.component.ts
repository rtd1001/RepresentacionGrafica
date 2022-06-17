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

    infoSeleccionada;

    constructor() {
        console.log('xd')
    }

    ngOnInit(): void {
        console.log(this.datos)
        for (const dato of this.datos) {
            this.datosGrafico.push({ name: dato.x, value: dato.y });
        }
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
            for (const valor of infoSeleccionada.chartInfo[0].y) {
                console.log(valor)
                this.graficoInfoAdicional.push({ name: infoSeleccionada.chartInfo[0].x + posicion, value: valor })
                posicion++;
            }
            console.log(this.graficoInfoAdicional)
        }


    }

}
