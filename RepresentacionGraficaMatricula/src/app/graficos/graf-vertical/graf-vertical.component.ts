import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-graf-vertical',
  templateUrl: './graf-vertical.component.html',
  styleUrls: ['./graf-vertical.component.css']
})
export class GrafVerticalComponent implements OnInit {

  saleData = [
    { name: "Mobiles", value: 105000 },
    { name: "Laptop", value: 55000 },
    { name: "AC", value: 15000 },
    { name: "Headset", value: 150000 },
    { name: "Fridge", value: 20000 }
  ];

  @Input() datos:any[];
  
  constructor() { }

  ngOnInit(): void {
  }

}
