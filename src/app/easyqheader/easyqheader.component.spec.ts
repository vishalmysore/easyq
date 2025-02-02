import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EasyqheaderComponent } from './easyqheader.component';

describe('EasyqheaderComponent', () => {
  let component: EasyqheaderComponent;
  let fixture: ComponentFixture<EasyqheaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EasyqheaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EasyqheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
