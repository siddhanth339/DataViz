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

  private subscription: Subscription | null = null;
  private priceChart: any = null;
  private priceChartOptions: any;
  private candlestickSeries: any;
  private volumeSeries: any;
  priceData: any;
  private priceDataSubject = new BehaviorSubject<any>(null);

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
          //console.log('setting new price data');
          this.priceDataSubject.next(this.priceData);
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }

  ngAfterViewInit() {
    this.priceDataSubject.subscribe((data): void => {
      //console.log('inside ngafterviewinit > price subject subscribe');
      //console.log(data);
      if (data) {
        if (this.priceChart === null){
          this.createPriceChart(); // Now the DOM element exists
        }
        else {
          this.updatePriceChart();
        }

      }
    });
  }

  private createPriceChart(): void {
    console.log('creating price chart');
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
   this.candlestickSeries = this.priceChart.addSeries(CandlestickSeries, { 
      upColor: '#26a69a', downColor: '#ef5350', borderVisible: false,
      wickUpColor: '#26a69a', wickDownColor: '#ef5350',
      title: 'Price' }, 
      0);

    
    this.candlestickSeries.setData(this.getCandleSticksChartData());
    this.volumeSeries = this.priceChart.addSeries(HistogramSeries, { color: '#26a69a', title: 'Volume'}, 1);
    
    this.volumeSeries.setData(this.getVolumesChartData());

    //Adjust the chart view to fit content
    this.priceChart.timeScale().fitContent();
  }

  private updatePriceChart(): void {
    console.log('updating price chart');
    this.candlestickSeries.setData(this.getCandleSticksChartData());
    this.volumeSeries.setData(this.getVolumesChartData());
  }

  private getCandleSticksChartData(): any[] {
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
    return chartData;

  }

  private getVolumesChartData(): any[] {
    let chartData = [];
  
    for (let key in this.priceData["Monthly Time Series"]) {
      const val = parseFloat(this.priceData['Monthly Time Series'][key]['5. volume']) / 1000000000;
      chartData.push({
        value: val,
        time: key,
        color: ''
      })
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
    return chartData;
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
