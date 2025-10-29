import { Component, OnInit, inject, Input } from '@angular/core'; // Input büyük harf ile import edilmeli
import { EarthquakeService } from 'src/app/services/earthquake.service';
import { Earthquake } from '../../models/earthquake.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-earthquake-alert-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './earthquake-alert-popup.html',
})
export class EarthquakeAlertPopupComponent implements OnInit {
  @Input() data?: Earthquake;

  private earthquakeService = inject(EarthquakeService);

  ngOnInit() {
    this.earthquakeService.getMockEarthquakes().subscribe(res => {
      if (!this.data) {
        this.data = res[0];
      }
    });
  }
}
