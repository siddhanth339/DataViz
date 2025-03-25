import { Component, OnDestroy, OnInit } from '@angular/core';
import { StockDataService } from '../../services/stock-data.service';
import { Subscription } from 'rxjs';
import { IncomeStatementChartComponent } from "../../income-statement-chart/income-statement-chart.component";

@Component({
  selector: 'app-stock-overview',
  imports: [IncomeStatementChartComponent, IncomeStatementChartComponent],
  templateUrl: './stock-overview.component.html',
  styleUrl: './stock-overview.component.css'
})
export class StockOverviewComponent implements OnInit, OnDestroy {
  data: any;
  incomeStatements: any;
  loading = false;
  error: string | null = null;
  private subscription: Subscription | null = null;

  constructor(private dataService: StockDataService) { }

  ngOnInit() {
    // Subscribe to the search query changes and make API calls accordingly
    this.subscription = this.dataService.searchQuery$.subscribe(query => {
      if (query) {
        this.fetchData(query);
      }
    });
    
    // Optional: fetch initial data if needed
    this.fetchData('IBM');
  }

  fetchData(query: string) {
    this.loading = true;
    this.error = null;
    if (query){
      this.dataService.getStockOverview(query).subscribe({
        next: (response) => {
          this.data = response;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to fetch data';
          this.loading = false;
          console.error(err);
        }
      });

      this.dataService.getIncomeStatementData(query).subscribe({
        next: (response) => {
          this.incomeStatements = response;
        },
        error: (err) => {
          this.error = 'Failed to fetch income statements';
          console.log(err);
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  formatMarketCap(marketCap: string): string {
    const num = parseFloat(marketCap);
    if (num >= 1e12) {
      return (num / 1e12).toFixed(2) + 'T';
    } else if (num >= 1e9) {
      return (num / 1e9).toFixed(2) + 'B';
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(2) + 'M';
    }
    return marketCap;
  }
  
  formatDate(dateStr: string): string {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  }
}