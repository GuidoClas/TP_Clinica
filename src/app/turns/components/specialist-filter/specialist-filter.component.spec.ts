import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialistFilterComponent } from './specialist-filter.component';

describe('SpecialistFilterComponent', () => {
  let component: SpecialistFilterComponent;
  let fixture: ComponentFixture<SpecialistFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecialistFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialistFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
