import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsergenComponent } from './usergen.component';

describe('UsergenComponent', () => {
  let component: UsergenComponent;
  let fixture: ComponentFixture<UsergenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsergenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsergenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
