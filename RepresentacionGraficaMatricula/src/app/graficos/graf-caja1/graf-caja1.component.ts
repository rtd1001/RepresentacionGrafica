import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-graf-caja1',
  templateUrl: './graf-caja1.component.html',
  styleUrls: ['./graf-caja1.component.css']
})
export class GrafCaja1Component implements OnInit {

  
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
