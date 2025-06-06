import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamiliasComponent } from './familias.component';

describe('FamiliasComponent', () => {
  let component: FamiliasComponent;
  let fixture: ComponentFixture<FamiliasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FamiliasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FamiliasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
