import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrafLineaComponent } from './graf-linea.component';

describe('GrafLineaComponent', () => {
  let component: GrafLineaComponent;
  let fixture: ComponentFixture<GrafLineaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrafLineaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrafLineaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
