import { AfterViewInit, Component, Input } from '@angular/core';
import { createChart, LineSeries } from 'lightweight-charts';

interface FinancialData {
  symbol: string;
  annualReports: FinancialReport[];
  quarterlyReports: FinancialReport[];
}
interface FinancialReport {
  fiscalDateEnding: string;
  reportedCurrency: string;
  grossProfit: string;
  totalRevenue: string;
  netIncome: string;
  ebitda: string;
}

@Component({
  selector: 'app-income-statement-chart',
  imports: [],
  templateUrl: './income-statement-chart.component.html',
  styleUrl: './income-statement-chart.component.css'
})
export class IncomeStatementChartComponent implements AfterViewInit{
  @Input() data: FinancialData = {} as FinancialData;
  private chart: any;
  private lineSeries: any;
  private netIncomeSeries: any;
  private chartOptions: any;
  private chartData: any;
  ngAfterViewInit() {
    if (this.data) {
      this.initChart();
    }
  }

  private initChart(): void {
    this.chartOptions = { 
      layout: { textColor: 'black', background: { type: 'solid', color: 'white' } }, 
      autoSize: true,
      };
    this.chart = createChart('incomeChartContainer', this.chartOptions);

    this.lineSeries = this.chart.addSeries(LineSeries, {
      color: '#2962FE',
  })
    this.chartData = [];
    if (this.data.annualReports){
      for (let i = 0; i < this.data.annualReports.length; i++) {
        this.chartData.push({
          value: parseFloat(this.data.annualReports[i].totalRevenue) / 1000000000, // Converting to billions for better visualization
          time: this.data.annualReports[i].fiscalDateEnding
        });
      }
    }
    
    this.chartData.reverse(); // for ascending order of data
  
  this.lineSeries.setData(this.chartData);

  this.netIncomeSeries = this.chart.addSeries(LineSeries, {
    color: '#f57f17',
})
  this.chartData = [];
  if (this.data.annualReports){
    for (let i = 0; i < this.data.annualReports.length; i++) {
      this.chartData.push({
        value: parseFloat(this.data.annualReports[i].netIncome) / 1000000000, // Converting to billions for better visualization
        time: this.data.annualReports[i].fiscalDateEnding
      });
    }
  }
  
  this.chartData.reverse(); // for ascending order of data

this.netIncomeSeries.setData(this.chartData);

this.chart.timeScale().fitContent();


  }

}




