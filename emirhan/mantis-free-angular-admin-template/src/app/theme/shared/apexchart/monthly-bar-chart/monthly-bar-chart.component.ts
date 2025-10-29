import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { ChartComponent, ApexOptions } from 'ng-apexcharts';
import { EarthquakeService } from 'src/app/services/earthquake.service';
import { Earthquake} from '../../../../models/earthquake.model';

@Component({
  selector: 'app-monthly-bar-chart',
  templateUrl: './monthly-bar-chart.component.html',
  styleUrls: ['./monthly-bar-chart.component.scss'],
  standalone: true,
  imports: [ChartComponent]
})
export class MonthlyBarChartComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  chartOptions: Partial<ApexOptions> = { series: [],
    chart: { height: 350, type: 'bar' },
    xaxis: { categories: [] }};
  private earthquakeService = inject(EarthquakeService);

  ngOnInit(): void {
    this.earthquakeService.getEarthquakes().subscribe((data: Earthquake[]) => {
      const locationNames = data.map(eq => eq.closestLocationName ?? 'Bilinmiyor');
      const magnitudes = data.map(eq => eq.mag);

      this.chartOptions = {
          chart: {
            height: 450,
          type: 'bar',
          toolbar: { show: false },
          background: 'transparent'
        },
        series: [{
          name: 'Magnitude',
          data: magnitudes
        }],
        xaxis: {
          categories: locationNames,
          labels: {
            style: { colors: Array(locationNames.length).fill('#8c8c8c') }
          },
          axisBorder: {
            show: true,
            color: '#f0f0f0'
          }
        },
        yaxis: {
          title: { text: 'Magnitude' },
          labels: { style: { colors: ['#8c8c8c'] } }
        },
        colors: ['#ff4d4f'],
        stroke: {
          curve: 'straight',
          width: 2
        },
        grid: {
          strokeDashArray: 0,
          borderColor: '#f5f5f5'
        },
        dataLabels: { enabled: false },
        theme: { mode: 'light' }
      };
    });
  }
}
