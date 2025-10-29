// earthquake-alert.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Earthquake } from '../models/earthquake.model';

@Injectable({ providedIn: 'root' })
export class EarthquakeAlertService {
  private alertsSubject = new BehaviorSubject<Earthquake[]>([]);
  alerts$ = this.alertsSubject.asObservable();

  updateAlerts(alerts: Earthquake[]) {
    this.alertsSubject.next(alerts);
  }
}
