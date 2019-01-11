import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowErrorValidComponent } from './show-error-valid.component';

describe('ShowErrorValidComponent', () => {
  let component: ShowErrorValidComponent;
  let fixture: ComponentFixture<ShowErrorValidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowErrorValidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowErrorValidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
