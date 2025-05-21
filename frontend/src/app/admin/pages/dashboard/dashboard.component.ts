import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { DashboardService } from '../../../core/services/dashboard.service';
import { CategoryProductCount } from '../../../core/models/category-product-count.model';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements AfterViewInit {
  loading = true;
  public categoryLabels: string[] = [];
  public categoryData: number[] = [];

  constructor(private dashboardService: DashboardService) {}

  @ViewChild('categoryChart') categoryChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('revenueChart') revenueChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('trafficChart') trafficChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('radarChart') radarChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('stackedChart') stackedChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('areaChart') areaChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieChart') pieChartRef!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    this.dashboardService.getProductCountPerCategory().subscribe({
      next: (data) => {
        this.categoryLabels = data.map(d => d.categoryName);
        this.categoryData = data.map(d => d.productCount);
        this.createDonutChart();
        this.createBarChart();
        this.createLineChart();
        this.createRadarChart();
        this.createStackedBarChart();
        this.createAreaChart();
        this.createPieChart();
      },
      error: (error) => {
        console.error('Error retrieving data for the donut chart')
        this.loading = false;
      }
    })
  }

  createDonutChart() {
    new Chart(this.categoryChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: this.categoryLabels,
        datasets: [{
          data: this.categoryData,
          backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b'],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        }
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

  createStackedBarChart() {
    new Chart(this.stackedChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [{
          label: 'Online Orders',
          data: [0, 0, 0, 0],
          backgroundColor: '#4e73df'
        },
      {
        label: 'Store Orders',
        data: [0, 0, 0, 0],
        backgroundColor: '#1cc88a'
      }
      ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            stacked: true
          },
          y: {
            stacked: true,
            beginAtZero: true
          }
        }
      }
    });
  }

  createAreaChart() {
    new Chart(this.areaChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr'],
        datasets: [{
          label: 'Active Users',
          data: [0, 0, 0, 0],
          fill: true,
          backgroundColor: 'rgba(28, 200, 138, 0.2)',
          borderColor: '#1cc88a',
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

  createPieChart() {
    new Chart(this.pieChartRef.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Admin', 'Customer', 'Guest'],
        datasets: [{
          data: [0, 0, 0],
          backgroundColor: ['#f6c23e', '#36b9cc', '#e74a3b']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }

}