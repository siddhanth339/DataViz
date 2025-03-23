import { Component } from '@angular/core';
import { AngularSplitModule } from 'angular-split';
import { StockOverviewComponent } from './stock-overview/stock-overview.component';
import { MainChartComponent } from './main-chart/main-chart.component';
@Component({
  selector: 'app-widgets',
  standalone: true,
  templateUrl: './widgets.component.html',
  imports: [StockOverviewComponent, MainChartComponent, AngularSplitModule]
})
export class WidgetsComponent {

}