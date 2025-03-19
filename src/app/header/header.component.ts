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

  constructor (private stockDataService: StockDataService) {}

  onSearch() {
    console.log('onSearch called, setting search query');
    if (this.searchQuery.trim()) {
      this.stockDataService.setSearchQuery(this.searchQuery.trim());
    }
  }
}