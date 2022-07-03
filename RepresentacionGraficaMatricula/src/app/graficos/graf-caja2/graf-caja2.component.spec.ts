import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrafCaja2Component } from './graf-caja2.component';

describe('GrafCaja2Component', () => {
  let component: GrafCaja2Component;
  let fixture: ComponentFixture<GrafCaja2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrafCaja2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrafCaja2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
