import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Earthquake } from 'src/app/models/earthquake.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EarthquakeService {
  private apiUrl = 'https://localhost:7203/api/earthquakes'; // kendi backend adresin
  private http = inject(HttpClient);

  getEarthquakes(): Observable<Earthquake[]> {
    return this.http.get<{ result: Earthquake[] }>(this.apiUrl).pipe(
      map(response => response.result)  // result dizisini alıyoruz
    );

  }
  getMockEarthquakes(): Observable<Earthquake[]> {
    return this.http.get<{ result: Earthquake[] }>('https://localhost:7203/api/earthquakes/mock')
      .pipe(map(response => response.result));
  }
}
