import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Filtro3Component } from './filtro3.component';

describe('Filtro3Component', () => {
  let component: Filtro3Component;
  let fixture: ComponentFixture<Filtro3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Filtro3Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Filtro3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
