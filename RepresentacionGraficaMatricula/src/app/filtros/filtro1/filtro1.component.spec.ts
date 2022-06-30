import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Filtro1Component } from './filtro1.component';

describe('Filtro1Component', () => {
  let component: Filtro1Component;
  let fixture: ComponentFixture<Filtro1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Filtro1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Filtro1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
