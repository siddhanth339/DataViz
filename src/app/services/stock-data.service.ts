import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StockDataService {
  private searchQuerySubject = new BehaviorSubject<string>('');
  public searchQuery$ = this.searchQuerySubject.asObservable();

  constructor(private http: HttpClient) { }

  setSearchQuery(query: string) {
    console.log('setting search query using BehaviorSubject next method');
    this.searchQuerySubject.next(query);
  }

  getStockOverview(symbol: string): Observable<any> {
    // Replace 'demo' with your actual API key
    const apiKey = environment.apiKey;
    const url = environment.apiUrl + symbol + '&apikey=' + apiKey;
    
    console.log('calling api - ' + url);
    return this.http.get(url);
  }
}