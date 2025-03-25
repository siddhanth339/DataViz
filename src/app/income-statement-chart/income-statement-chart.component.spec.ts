import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeStatementChartComponent } from './income-statement-chart.component';

describe('IncomeStatementChartComponent', () => {
  let component: IncomeStatementChartComponent;
  let fixture: ComponentFixture<IncomeStatementChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomeStatementChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomeStatementChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
