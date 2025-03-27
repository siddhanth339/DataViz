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
  private priceChart: any;
  private priceChartOptions: any;

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
    this.priceChartOptions = {
      layout: { textColor: 'black', background: { type: 'solid', color: 'white' } },
      autoSize: true
    };
    this.priceChart = createChart('priceChartContainer', this.priceChartOptions);

    // top parameter sets 0.7 or 70% empty space from the top of the chart
    // bottom sets 0% from the bottom of the chart to make the chart align with the x axis
    this.priceChart.priceScale('right').applyOptions({

    });
   const candlestickSeries = this.priceChart.addSeries(CandlestickSeries, { 
      upColor: '#26a69a', downColor: '#ef5350', borderVisible: false, wickUpColor: '#26a69a', wickDownColor: '#ef5350' });

    let chartData = [];

    for (let key in this.priceData["Monthly Time Series"]) {
      chartData.push({
        open: parseFloat(this.priceData['Monthly Time Series'][key]["1. open"]),
        high: parseFloat(this.priceData['Monthly Time Series'][key]["2. high"]),
        low: parseFloat(this.priceData['Monthly Time Series'][key]["3. low"]),
        close: parseFloat(this.priceData['Monthly Time Series'][key]["4. close"]),
        time: key
      })
    }
    chartData.reverse(); // to have data sorted from oldest to latest price on the price chart from left to right
    candlestickSeries.setData(chartData);
    //Adjust the chart view to fit content
    this.priceChart.timeScale().fitContent();
  }





  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}


// volumes are generally in hundreds of thousands but price can range from < 100 to a few thousand