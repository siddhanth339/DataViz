import { Component } from '@angular/core';
import { StockOverviewComponent } from './stock-overview/stock-overview.component';
@Component({
  selector: 'app-widgets',
  standalone: true,
  templateUrl: './widgets.component.html',
  imports: [StockOverviewComponent]
})
export class WidgetsComponent {

}