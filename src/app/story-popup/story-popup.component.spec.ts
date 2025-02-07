import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryPopupComponent } from './story-popup.component';

describe('StoryPopupComponent', () => {
  let component: StoryPopupComponent;
  let fixture: ComponentFixture<StoryPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoryPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoryPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
