import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotesResultComponent } from './votes-result.component';

describe('VotesResultComponent', () => {
  let component: VotesResultComponent;
  let fixture: ComponentFixture<VotesResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VotesResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VotesResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
