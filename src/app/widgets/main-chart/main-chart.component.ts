import { Component, OnDestroy, OnInit } from '@angular/core';
import { StockDataService } from '../../services/stock-data.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CandlestickSeries, createChart, HistogramSeries } from 'lightweight-charts';

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
    const candlestickSeries = this.chart.addSeries(CandlestickSeries, { upColor: '#26a69a', downColor: '#ef5350', borderVisible: false, wickUpColor: '#26a69a', wickDownColor: '#ef5350' });

    this.chartData = [];
       for (let key in this.priceData["Monthly Time Series"]) {
      this.chartData.push({
        open: parseFloat(this.priceData['Monthly Time Series'][key]["1. open"]),
        high: parseFloat(this.priceData['Monthly Time Series'][key]["2. high"]),
        low: parseFloat(this.priceData['Monthly Time Series'][key]["3. low"]),
        close: parseFloat(this.priceData['Monthly Time Series'][key]["4. close"]),
        time: key
      })
    }
    this.chartData.reverse(); // to have data sorted from oldest to latest price on the price chart from left to right
    candlestickSeries.setData(this.chartData);

    this.chartData = [];
    for (let key in this.priceData["Monthly Time Series"]) {
      this.chartData.push({
        value: parseFloat(this.priceData['Monthly Time Series'][key]['5. volume']) / 1000000000,
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
