import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StockDataService } from '../services/stock-data.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './header.component.html',
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class HeaderComponent {
  searchQuery: string = '';
  searchResults:any[] = [];
  showDropdown = false;

  constructor(private stockDataService: StockDataService) {
    // Subscribe to search results
    this.stockDataService.searchResults$.subscribe((results: any) => {
      //console.log("assigning searchResults");
      if (results && results.bestMatches) {
        this.searchResults = results.bestMatches;
        this.showDropdown = Array.isArray(this.searchResults) && this.searchResults.length > 0;
        //console.log(this.searchResults);
      } else {
        this.searchResults = [];
        this.showDropdown = false;
      }
    });
  }

  onInputChange() {
    // As user types, trigger the debounced search
    this.stockDataService.onSearchInput(this.searchQuery);
  }

  onSelectResult(result: any) {
    // When user selects an item from dropdown
    this.searchQuery = result['1. symbol'];
    this.showDropdown = false;
    this.stockDataService.setSearchQuery(this.searchQuery);
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.stockDataService.setSearchQuery(this.searchQuery.trim());
      this.showDropdown = false;
    }
  }
}