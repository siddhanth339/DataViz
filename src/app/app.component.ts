import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { WidgetsComponent } from './widgets/widgets.component';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, WidgetsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'DataViz';
}
