import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnApplicationComponent } from './turn-application.component';

describe('TurnApplicationComponent', () => {
  let component: TurnApplicationComponent;
  let fixture: ComponentFixture<TurnApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TurnApplicationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurnApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
