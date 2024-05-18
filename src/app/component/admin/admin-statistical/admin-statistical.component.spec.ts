import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminStatisticalComponent } from './admin-statistical.component';

describe('AdminStatisticalComponent', () => {
  let component: AdminStatisticalComponent;
  let fixture: ComponentFixture<AdminStatisticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminStatisticalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminStatisticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
