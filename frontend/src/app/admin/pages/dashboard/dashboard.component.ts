import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements AfterViewInit {
  loading = true;

  @ViewChild('categoryChart') categoryChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('revenueChart') revenueChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('trafficChart') trafficChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('radarChart') radarChartRef!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    // Delay the loading to allow Angular to update the DOM.
    setTimeout(() => {
      this.loading = false;

      // Simulated data loading from the backend
      setTimeout(() => {
        this.createDonutChart();
        this.createBarChart();
        this.createLineChart();
        this.createRadarChart();
      }, 0);
    }, 1000);
  }

  createDonutChart() {
    new Chart(this.categoryChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e'],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        cutout: '74%'
      }
    });
  }

  createBarChart() {
    new Chart(this.revenueChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
          label: 'Revenue (€)',
          data: [0, 0, 0, 0, 0],
          backgroundColor: '#36b9cc'
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  createLineChart() {
    new Chart(this.trafficChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
          label: 'Visitors',
          data: [0, 0, 0, 0],
          fill: true,
          borderColor: '#4e73df',
          backgroundColor: 'rgba(78, 115, 223, 0.1)',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  createRadarChart() {
    new Chart(this.radarChartRef.nativeElement, {
      type: 'radar',
      data: {
        labels: ['Speed', 'Quality', 'Suppot', 'Features', 'Usability'],
        datasets: [{
          label: 'Score',
          data: [0, 0, 0, 0, 0],
          backgroundColor: 'rgba(54, 185, 204, 0.2)',
          borderColor: '#36b9cc',
          pointBackgroundColor: '#36b9cc'
        }]
      },
      options: {
        responsive: true,
        scales: {
          r: {
            beginAtZero: true
          }
        }
      }
    });
  }

}
