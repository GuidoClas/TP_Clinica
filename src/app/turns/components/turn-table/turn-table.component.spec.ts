import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnTableComponent } from './turn-table.component';

describe('TurnTableComponent', () => {
  let component: TurnTableComponent;
  let fixture: ComponentFixture<TurnTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TurnTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurnTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
