import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EarthquakeAlertPopupComponent } from 'src/app/components/earthquake-alert/earthquake-alert-popup';
import { Earthquake } from 'src/app/models/earthquake.model';
// Project imports
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { EarthquakeAlertComponent } from 'src/app/components/earthquake-alert/earthquake-alert';
import { EarthquakeService } from 'src/app/services/earthquake.service';

@Component({
  selector: 'app-sample-page',
  standalone: true,
  imports: [CommonModule, CardComponent, EarthquakeAlertComponent,EarthquakeAlertPopupComponent], // ✅ tablonu ekle
  templateUrl: './sample-page.component.html',
  styleUrls: ['./sample-page.component.scss']
})
export class SamplePageComponent {
  private earthquakeService = inject(EarthquakeService); // 👈 inject burada

  latestDangerousQuake: Earthquake | null = null;

  ngOnInit() {
    this.earthquakeService.getEarthquakes().subscribe(data => {
      const dangerous = data.find(q => q.isDangerous);
      if (dangerous) {
        this.latestDangerousQuake = dangerous;
      }
    });

  }
}
