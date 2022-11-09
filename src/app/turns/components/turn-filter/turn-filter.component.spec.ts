import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnFilterComponent } from './turn-filter.component';

describe('TurnFilterComponent', () => {
  let component: TurnFilterComponent;
  let fixture: ComponentFixture<TurnFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TurnFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurnFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
