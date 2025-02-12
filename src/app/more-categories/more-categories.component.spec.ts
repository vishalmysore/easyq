import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreCategoriesComponent } from './more-categories.component';

describe('MoreCategoriesComponent', () => {
  let component: MoreCategoriesComponent;
  let fixture: ComponentFixture<MoreCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoreCategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoreCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
