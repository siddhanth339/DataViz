import { Component, OnInit } from '@angular/core';
import { StockDataService } from '../../services/stock-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-stock-overview',
  imports: [],
  templateUrl: './stock-overview.component.html',
  styleUrl: './stock-overview.component.css'
})
export class StockOverviewComponent implements OnInit {
  data: any;
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
    this.fetchData('');
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
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}