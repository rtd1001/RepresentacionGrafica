import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrafVerticalComponent } from './graf-vertical.component';

describe('GrafVerticalComponent', () => {
  let component: GrafVerticalComponent;
  let fixture: ComponentFixture<GrafVerticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrafVerticalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrafVerticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
