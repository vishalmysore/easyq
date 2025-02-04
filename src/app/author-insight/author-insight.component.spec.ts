import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorInsightComponent } from './author-insight.component';

describe('AuthorInsightComponent', () => {
  let component: AuthorInsightComponent;
  let fixture: ComponentFixture<AuthorInsightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorInsightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorInsightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
