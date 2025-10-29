import { Component, AfterViewInit, ChangeDetectorRef, inject } from '@angular/core';
import maplibregl from 'maplibre-gl';
import { EarthquakeService } from 'src/app/services/earthquake.service';
import { Earthquake } from 'src/app/models/earthquake.model';
import type * as GeoJSON from 'geojson';
import { criticalLocations } from 'src/app/components/city-terminal.locations';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss']
})
export class ColorComponent implements AfterViewInit {
  private earthquakeService = inject(EarthquakeService);
  private cdr = inject(ChangeDetectorRef);

  private map!: maplibregl.Map;

  ngAfterViewInit(): void {
    const terminalFeatures: GeoJSON.Feature[] = criticalLocations.map(location => ({
      type: "Feature",
      properties: {
        name: location.name
      },
      geometry: {
        type: "Point",
        coordinates: [location.lon, location.lat]
      }
    }));

    // 1. Map oluştur
    this.map = new maplibregl.Map({
      container: 'map',
      style: 'https://demotiles.maplibre.org/style.json',
      center: [35.2433, 38.9637], // Türkiye merkezi
      zoom: 6,
      maxBounds: [
        [25.0, 35.0], // SW sınır (lng, lat)
        [45.0, 43.5]  // NE sınır (lng, lat)
      ]
    });

    this.map.on('load', () => {
      // Terminal kaynağı ve katmanı ekle
      this.map.addSource('terminals', {
        type: 'geojson',
        data: {
          type: "FeatureCollection",
          features: terminalFeatures
        }
      });

      this.map.addLayer({
        id: 'terminal-circles',
        type: 'circle',
        source: 'terminals',
        paint: {
          'circle-radius': 6,
          'circle-color': '#007cbf',
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 1
        }
      });

      // Terminal simgelerine tıklanınca popup aç
      this.map.on('click', 'terminal-circles', (e) => {
        const feature = e.features?.[0];
        if (!feature) return;

        if (feature.geometry.type === 'Point') {
          const coordinates = feature.geometry.coordinates as [number, number];
          const name = feature.properties?.['name'];

          new maplibregl.Popup()
            .setLngLat(coordinates)
            .setHTML(`<strong>Terminal: ${name}</strong>`)
            .addTo(this.map);
        }
      });

      // İmleç terminal dairelerinin üstüne gelince pointer göster
      this.map.on('mouseenter', 'terminal-circles', () => {
        this.map.getCanvas().style.cursor = 'pointer';
      });
      this.map.on('mouseleave', 'terminal-circles', () => {
        this.map.getCanvas().style.cursor = '';
      });

      // Deprem kaynağı ve boş katman ekle
      this.map.addSource('earthquakes', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      // Deprem dairelerine tıklanınca popup aç
      this.map.on('click', 'earthquake-circles', (e) => {
        const feature = e.features?.[0];
        if (!feature) return;

        if (feature.geometry.type === 'Point') {
          const coordinates = feature.geometry.coordinates as [number, number];
          const props = feature.properties;

          const popupContent = `
            <strong>${props?.['title']}</strong><br/>
            <b>Büyüklük:</b> ${props?.['mag']}<br/>
            <b>Derinlik:</b> ${props?.['depth']} km<br/>
            <b>Tarih:</b> ${props?.['date']}
          `;

          new maplibregl.Popup()
            .setLngLat(coordinates)
            .setHTML(popupContent)
            .addTo(this.map);
        }
      });

      // Deprem katmanı
      this.map.addLayer({
        id: 'earthquake-circles',
        type: 'circle',
        source: 'earthquakes',
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['get', 'mag'],
            1, 4,
            2, 8,
            3, 12,
            4, 16,
            5, 20,
            6, 24,
            7, 28,
            8, 32
          ],
          'circle-color': [
            'interpolate',
            ['linear'],
            ['get', 'mag'],
            1, '#ff9999',
            3, '#ff4d4d',
            5, '#e60000',
            7, '#990000'
          ],
          'circle-opacity': 0.85,
          'circle-stroke-color': '#000000',
          'circle-stroke-width': 1.2,
          'circle-stroke-opacity': 0.4
        }
      });

      // Deprem verilerini yükle
      this.loadEarthquakeData();
    });
  }

  private loadEarthquakeData() {
    this.earthquakeService.getEarthquakes().subscribe((earthquakes: Earthquake[]) => {
      const earthquakesGeoJson: GeoJSON.FeatureCollection = {
        type: "FeatureCollection",
        features: earthquakes.map(eq => ({
          type: "Feature",
          properties: {
            mag: Number(eq.mag),
            title: eq.title,
            depth: eq.depth,
            date: eq.date,
          },
          geometry: eq.geojson
        }))
      };

      const source = this.map.getSource('earthquakes') as maplibregl.GeoJSONSource;

      if (source) {
        source.setData(earthquakesGeoJson);
      }

      this.cdr.detectChanges();
    });
  }
}


