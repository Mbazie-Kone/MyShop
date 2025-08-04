import { AfterViewChecked, AfterViewInit, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { DashboardService } from '../../../core/services/dashboard.service';
import { CategoryProductCount } from '../../../core/models/category-product-count.model';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements AfterViewChecked, AfterViewInit {
  loading = true;
  private donutChartInitialized = false;
  
  // Make Math available in template
  Math = Math;
  
  public categoryLabels: string[] = [];
  public categoryData: number[] = [];
  public categories: CategoryProductCount[] = [];

  // Dashboard statistics
  public stats = {
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalBalance: 0,
    ordersChange: 0,
    revenueChange: 0,
    customersChange: 0
  };

  // Recent orders data
  public recentOrders: {id: string, customer: string, amount: number, status: string}[] = [];
  
  // Top products data
  public topProducts: {name: string, sales: number, revenue: number}[] = [];

  private dashboardService = inject(DashboardService);

  @ViewChild('categoryChart') categoryChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('revenueChart') revenueChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('trafficChart') trafficChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('radarChart') radarChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('stackedChart') stackedChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('areaChart') areaChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieChart') pieChartRef!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // Simula il caricamento dei dati reali
    setTimeout(() => {
      // Genera dati statistici realistici
      this.stats = {
        totalOrders: 5312,
        totalRevenue: 89312,
        totalCustomers: 15847,
        totalBalance: 35640,
        ordersChange: -2.29,
        revenueChange: 12.45,
        customersChange: 5.16
      };

      // Genera dati per categorie
      this.categoryLabels = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'];
      this.categoryData = [45, 32, 28, 15, 20];

      // Genera ordini recenti
      this.recentOrders = [
        { id: '#ORD-001', customer: 'Mario Rossi', amount: 299.99, status: 'Completed' },
        { id: '#ORD-002', customer: 'Anna Verdi', amount: 149.50, status: 'Processing' },
        { id: '#ORD-003', customer: 'Luca Bianchi', amount: 79.99, status: 'Shipped' },
        { id: '#ORD-004', customer: 'Sara Neri', amount: 199.00, status: 'Pending' },
        { id: '#ORD-005', customer: 'Paolo Gialli', amount: 89.99, status: 'Completed' }
      ];

      // Genera prodotti top
      this.topProducts = [
        { name: 'iPhone 15 Pro', sales: 234, revenue: 234000 },
        { name: 'Samsung Galaxy S24', sales: 189, revenue: 151200 },
        { name: 'MacBook Air M3', sales: 145, revenue: 174000 },
        { name: 'AirPods Pro', sales: 298, revenue: 74500 },
        { name: 'iPad Air', sales: 167, revenue: 100200 }
      ];

      this.loading = false;

      // Crea tutti i grafici
      this.createRevenueChart();
      this.createTrafficChart();
      this.createSalesChart();
      this.createUserDistributionChart();
      this.createMonthlyComparisonChart();
      this.createGrowthTrendChart();
    }, 2000);
  }

  ngAfterViewChecked(): void {
    if (!this.donutChartInitialized && this.categoryChartRef) {
      if (this.categoryLabels.length && this.categoryData.length) {
        this.createDonutChart();
        this.donutChartInitialized = true;
      }
    }
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

  createRevenueChart() {
    if (!this.revenueChartRef?.nativeElement) return;
    
    new Chart(this.revenueChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Revenue 2024 (€)',
          data: [12500, 15200, 18700, 22300, 19800, 25600, 28900, 31200, 27800, 33500, 29700, 35400],
          borderColor: '#667eea',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          fill: true,
          tension: 0.4,
          borderWidth: 3,
          pointBackgroundColor: '#667eea',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 5
        }, {
          label: 'Revenue 2023 (€)',
          data: [10200, 12800, 15400, 18900, 16700, 21200, 24500, 26800, 23400, 28200, 25100, 30600],
          borderColor: '#1cc88a',
          backgroundColor: 'rgba(28, 200, 138, 0.1)',
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointBackgroundColor: '#1cc88a',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 20
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#667eea',
            borderWidth: 1
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              callback: function(value) {
                return '€' + value.toLocaleString();
              }
            }
          }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        }
      }
    });
  }

  createTrafficChart() {
    if (!this.trafficChartRef?.nativeElement) return;
    
    new Chart(this.trafficChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Desktop', 'Mobile', 'Tablet'],
        datasets: [{
          data: [65, 28, 7],
          backgroundColor: ['#667eea', '#1cc88a', '#f6c23e'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.label + ': ' + context.parsed + '%';
              }
            }
          }
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

  createSalesChart() {
    if (!this.stackedChartRef?.nativeElement) return;
    
    new Chart(this.stackedChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: this.categoryLabels,
        datasets: [{
          label: 'Sales',
          data: [1250, 980, 750, 420, 680],
          backgroundColor: '#667eea',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff'
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          }
        }
      }
    });
  }

  createUserDistributionChart() {
    if (!this.pieChartRef?.nativeElement) return;
    
    new Chart(this.pieChartRef.nativeElement, {
      type: 'pie',
      data: {
        labels: ['New Users', 'Returning Users', 'VIP Users'],
        datasets: [{
          data: [45, 40, 15],
          backgroundColor: ['#667eea', '#1cc88a', '#f6c23e'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.label + ': ' + context.parsed + '%';
              }
            }
          }
        }
      }
    });
  }

  createMonthlyComparisonChart() {
    if (!this.areaChartRef?.nativeElement) return;
    
    new Chart(this.areaChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Orders',
          data: [420, 389, 501, 432, 578, 612],
          borderColor: '#667eea',
          backgroundColor: 'rgba(102, 126, 234, 0.2)',
          fill: true,
          tension: 0.4,
          borderWidth: 2
        }, {
          label: 'Customers',
          data: [312, 298, 356, 389, 445, 478],
          borderColor: '#1cc88a',
          backgroundColor: 'rgba(28, 200, 138, 0.2)',
          fill: true,
          tension: 0.4,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 20
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          }
        }
      }
    });
  }

  createGrowthTrendChart() {
    if (!this.radarChartRef?.nativeElement) return;
    
    new Chart(this.radarChartRef.nativeElement, {
      type: 'radar',
      data: {
        labels: ['Sales', 'Marketing', 'Customer Service', 'Product Quality', 'Delivery'],
        datasets: [{
          label: 'Performance Score',
          data: [85, 78, 92, 88, 76],
          backgroundColor: 'rgba(102, 126, 234, 0.2)',
          borderColor: '#667eea',
          borderWidth: 2,
          pointBackgroundColor: '#667eea',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            angleLines: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            pointLabels: {
              font: {
                size: 12
              }
            }
          }
        }
      }
    });
  }

  // Utility methods for formatting
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('it-IT').format(num);
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed': return 'badge bg-success';
      case 'processing': return 'badge bg-warning';
      case 'shipped': return 'badge bg-info';
      case 'pending': return 'badge bg-secondary';
      default: return 'badge bg-light';
    }
  }

}