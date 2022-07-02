import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrafCaja1Component } from './graf-caja1.component';

describe('GrafCaja1Component', () => {
  let component: GrafCaja1Component;
  let fixture: ComponentFixture<GrafCaja1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrafCaja1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrafCaja1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
