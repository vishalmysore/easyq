import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingArticlesComponent } from './trending-articles.component';

describe('TrendingArticlesComponent', () => {
  let component: TrendingArticlesComponent;
  let fixture: ComponentFixture<TrendingArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrendingArticlesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrendingArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
