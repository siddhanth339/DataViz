import { Component, OnDestroy, OnInit } from '@angular/core';
import { StockDataService } from '../../services/stock-data.service';
import { Subscription } from 'rxjs';
import { createChart, HistogramSeries } from 'lightweight-charts';

@Component({
  selector: 'app-main-chart',
  imports: [],
  templateUrl: './main-chart.component.html',
  styleUrl: './main-chart.component.css'
})
export class MainChartComponent implements OnInit, OnDestroy {
  priceData: any;
  private subscription: Subscription | null = null;
  private chartData: any;
  private chart: any;
  private chartOptions: any;
  constructor(private dataService: StockDataService) { }

  ngOnInit() {
    this.subscription = this.dataService.searchQuery$.subscribe(query => {
      if (query) {
        this.getPriceData(query);
      }

      this.getPriceData('IBM');
    });
  }

  getPriceData(query: string) {
    if (query) {
      this.dataService.getStockPrice(query).subscribe({
        next: (response) => {
          this.priceData = response;
        },
        error: (err) => {
          console.error(err);
        }
      })
    }
  }

  ngAfterViewInit() {
    if (this.priceData) {
      this.createPriceChart();
    }
  }

  private createPriceChart(): void {
    this.chartOptions = { 
      layout: { textColor: 'black', background: { type: 'solid', color: 'white' } }, 
      autoSize: true,
      };
    this.chart = createChart('priceChartContainer', this.chartOptions);

    const histogramSeries = this.chart.addSeries(HistogramSeries, { color: '#26a69a' });
    //upColor: '#26a69a', downColor: '#ef5350'
    this.chartData = []
    for (let key in this.priceData["Monthly Time Series"]) {
      this.chartData.push({
        value: parseFloat(this.priceData['Monthly Time Series'][key]['5. volume']),
        time: key
      })
    }
    this.chartData.reverse();
    histogramSeries.setData(this.chartData);

    this.chart.timeScale().fitContent();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
