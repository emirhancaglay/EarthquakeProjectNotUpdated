import { Component, OnInit, inject } from '@angular/core';
import * as L from 'leaflet';
import { EarthquakeService } from '../services/earthquake.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  private map!: L.Map;

  private earthquakeService = inject(EarthquakeService);


  ngOnInit(): void {
    this.initMap();
    this.loadEarthquakes();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [39.0, 35.0], // Türkiye'nin ortası
      zoom: 6
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  }

  private loadEarthquakes(): void {
    this.earthquakeService.getEarthquakes().subscribe(data => {
      data.forEach(eq => {
        const lat = eq.geojson.coordinates[1];
        const lng = eq.geojson.coordinates[0];

        // Deprem noktası
        L.circleMarker([lat, lng], {
          radius: eq.mag * 1.5,
          color: eq.isDangerous ? 'red' : 'blue',
          fillOpacity: 0.6
        }).bindPopup(`<b>${eq.title}</b><br>Büyüklük: ${eq.mag}`).addTo(this.map);
      });

      // Terminal göstergesi örnek (sabit konumlu)
      L.marker([39.9, 32.85], {
        icon: L.icon({
          iconUrl: 'assets/terminal-icon.png',
          iconSize: [25, 25]
        })
      }).bindPopup('Terminal: Ankara').addTo(this.map);
    });
  }
}
