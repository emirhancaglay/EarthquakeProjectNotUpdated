import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EarthquakeAlertService } from 'src/app/services/earthquake-alert.service';
import { Earthquake } from 'src/app/models/earthquake.model';

@Component({
  selector: 'app-earthquake-alert-dropdown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="alert-dropdown">
      <div *ngIf="alerts.length === 0">Uyarı yok</div>
      <div *ngFor="let alert of alerts" class="alert-item">
        <strong>{{ alert.title }}</strong><br />
        <small>{{ alert.closestLocationName }}</small>
      </div>
    </div>
  `,
  styles: [`
    .alert-dropdown {
      background: white;
      border: 1px solid #ccc;
      padding: 10px;
      max-width: 300px;
      position: absolute;
      right: 0;
      top: 40px;
      z-index: 1000;
    }
    .alert-item {
      border-bottom: 1px solid #eee;
      margin-bottom: 8px;
      padding-bottom: 6px;
    }
  `]
})
export class EarthquakeAlertDropdownComponent {
  alerts: Earthquake[] = [];
  private alertService = inject(EarthquakeAlertService);

  constructor() {
    this.alertService.alerts$.subscribe(data => {
      this.alerts = data;
    });
  }
}
