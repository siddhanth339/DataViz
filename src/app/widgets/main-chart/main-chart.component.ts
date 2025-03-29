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
      layout: { textColor: 'black', background: { type: 'solid', color: 'white' }, panes: {
        separatorColor: '#f22c3d',
        separatorHoverColor: 'rgba(255, 0, 0, 0.1)',
        // setting this to false will disable the resize of the panes by the user
        enableResize: false,
    } },
      autoSize: true
    };
    this.priceChart = createChart('priceChartContainer', this.priceChartOptions);

    // 0 at the end set's the pane index for charts. Panes are like separations within a chart to display multiple series
   const candlestickSeries = this.priceChart.addSeries(CandlestickSeries, { 
      upColor: '#26a69a', downColor: '#ef5350', borderVisible: false,
      wickUpColor: '#26a69a', wickDownColor: '#ef5350',
      title: 'Price' }, 
      0);

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

    const volumeSeries = this.priceChart.addSeries(HistogramSeries, { color: '#26a69a', title: 'Volume'}, 1);
    chartData = [];
    let prevValue = -1;
    let currentBarColor = '#26a69a';

    for (let key in this.priceData["Monthly Time Series"]) {
      const val = parseFloat(this.priceData['Monthly Time Series'][key]['5. volume']) / 1000000000;
      chartData.push({
        value: val,
        time: key,
        color: ''
      })
      prevValue = val;
    }
    chartData.reverse();

    chartData.map((item, index, array) => {
      if (index > 0) {
        const previousItem = array[index - 1];
        item.color = item.value > previousItem.value ? '#26a69a' : '#ef5350';
      } else {
          item.color = '#26a69a'; //set the first item to gray or any other color you want.
      }
      return item;
    })
    
    volumeSeries.setData(chartData);

    //Adjust the chart view to fit content
    this.priceChart.timeScale().fitContent();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
