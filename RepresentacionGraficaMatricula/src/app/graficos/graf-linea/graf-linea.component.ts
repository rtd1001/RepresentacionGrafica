import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-graf-linea',
  templateUrl: './graf-linea.component.html',
  styleUrls: ['./graf-linea.component.css']
})
export class GrafLineaComponent implements OnInit {

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
