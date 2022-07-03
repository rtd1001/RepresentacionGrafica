import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Filtro4Component } from './filtro4.component';

describe('Filtro4Component', () => {
  let component: Filtro4Component;
  let fixture: ComponentFixture<Filtro4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Filtro4Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Filtro4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
