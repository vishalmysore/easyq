import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsComponentComponent } from './results-component.component';

describe('ResultsComponentComponent', () => {
  let component: ResultsComponentComponent;
  let fixture: ComponentFixture<ResultsComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultsComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
