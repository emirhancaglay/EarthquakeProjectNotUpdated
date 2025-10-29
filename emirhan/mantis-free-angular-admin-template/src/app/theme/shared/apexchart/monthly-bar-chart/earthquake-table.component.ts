import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Earthquake {
  title: string;
  magnitude: number;
  date: string;
  isDangerous: boolean;
  closestLocationName: string;
}

@Component({
  selector: 'app-earthquake-table',
  templateUrl: './earthquake-table.component.html',
  styleUrls: ['./earthquake-table.component.ts']
})
export class EarthquakeTableComponent implements OnInit {
  earthquakes: Earthquake[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchEarthquakes();
  }

  fetchEarthquakes(): void {
    this.http.get<Earthquake[]>('https://localhost:5001/api/earthquakes') // API adresin neyse onu koy
      .subscribe(data => {
        this.earthquakes = data;
      });
  }
}
