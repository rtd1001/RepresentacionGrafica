import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-graf-caja2',
  templateUrl: './graf-caja2.component.html',
  styleUrls: ['./graf-caja2.component.css']
})
export class GrafCaja2Component implements OnInit {

  datosGrafico: any[] = [];

  @Input() datos: any[];

  series: any[];

  infoSeleccionada;

  constructor() {
  }

  ngOnInit(): void {
    const datosLimpios = [];
        for (const dato of this.datos) {
            if (dato) datosLimpios.push(dato);
        }
        this.datosGrafico = datosLimpios;
  }

}
