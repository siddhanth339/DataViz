import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StockDataService {
  private searchQuerySubject = new BehaviorSubject<string>('');
  public searchQuery$ = this.searchQuerySubject.asObservable();

  private searchInputSubject = new Subject<string>();
  
  public searchResults$: Observable<any[]> = this.searchInputSubject.pipe(
    debounceTime(300), // Wait for 300ms pause in events
    distinctUntilChanged(), // Only emit if value is different from previous
    switchMap(term => this.searchSymbols(term))
  );

  constructor(private http: HttpClient) { }

  setSearchQuery(query: string) {
    console.log('setting search query using BehaviorSubject next method');
    this.searchQuerySubject.next(query);
  }

  // Call this method when user is typing
  onSearchInput(term: string) {
    if (term.length > 1) {
      this.searchInputSubject.next(term);
    }
  }

  // Search for stock symbols
  searchSymbols(term: string): Observable<any[]> {
    if (!term.trim()) {
      return new Observable(observer => {
        observer.next([]);
        observer.complete();
      });
    }
    
    const apiKey = environment.apiKey;
    const url = environment.symbolApiUrl + term + '&apikey=' + apiKey;
    
    return this.http.get<any>(url);
  }
  getStockOverview(symbol: string): Observable<any> {
    // Replace 'demo' with your actual API key
    const apiKey = environment.apiKey;
    const url = environment.apiUrl + symbol + '&apikey=' + apiKey;
    
    console.log('calling api - ' + url);
    return this.http.get(url);
  }
}