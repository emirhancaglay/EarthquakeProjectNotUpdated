  import { Component, inject } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { EarthquakeAlertService } from '../../services/earthquake-alert.service';
  import { EarthquakeService } from '../../services/earthquake.service';
  import { Earthquake } from '../../models/earthquake.model';
  import { criticalLocations, calculateDistance } from 'src/app/components/city-terminal.locations';
  import { MatDialog, MatDialogModule } from '@angular/material/dialog';
  import { EarthquakeAlertPopupComponent } from 'src/app/components/earthquake-alert/earthquake-alert-popup';
  @Component({
    selector: 'app-earthquake-alert',
    standalone: true,
    imports: [CommonModule,MatDialogModule],
    templateUrl: './earthquake-alert.html',
  })
  export class EarthquakeAlertComponent {
    private earthquakeService = inject(EarthquakeService);
    private alertService = inject(EarthquakeAlertService); // yeni servis
    private dialog = inject(MatDialog);

    earthquakes: Earthquake[] = [];
    alertedIds = new Set<number>();
    constructor() {
      this.loadEarthquakes();
      this.checkEarthquakesPeriodically();
    }
    get dangerousQuakes(): Earthquake[] {
      return this.earthquakes.filter(eq => eq.isDangerous);
    }
    checkEarthquakesPeriodically() {
      setInterval(() => {
        this.earthquakeService.getEarthquakes().subscribe(response => {
          response.forEach(eq => {
            if (eq.isDangerous && !this.alertedIds.has(eq.earthquake_id)) {
              this.alertedIds.add(eq.earthquake_id);

              this.dialog.open(EarthquakeAlertPopupComponent, {
                data: eq
              });
            }
          });
        });
      }, 30000); // 30 saniyede bir kontrol
    }


    loadEarthquakes() {
      this.earthquakeService.getEarthquakes().subscribe(response => {
        this.earthquakes = response.map(eq => {
          const eqLon = eq.geojson.coordinates[0];
          const eqLat = eq.geojson.coordinates[1];

          let closestLocationName = '';
          let minDistance = Infinity;

          criticalLocations.forEach(location => {
            const distance = calculateDistance(eqLat, eqLon, location.lat, location.lon);
            if (distance <= 100 && distance < minDistance) {
              minDistance = distance;
              closestLocationName = location.name;
            }
          });

          const isClose = closestLocationName !== '';

          return {
            ...eq,
            isDangerous: isClose,
            closestLocationName  // Bu alanı ekledik
          };
        });
        this.alertService.updateAlerts(this.dangerousQuakes);
      });
    }
  }

