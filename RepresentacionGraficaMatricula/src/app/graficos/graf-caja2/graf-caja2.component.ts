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
    console.log('datos')
      console.log(this.datos)
    /*  for (const dato of this.datos) {
          this.datosGrafico.push({ name: dato.x, value: dato.y });
      }
      this.datosGrafico.push(this.datos);
      console.log(this.datosGrafico);*/
      this.datosGrafico = this.datos;
  }

}
