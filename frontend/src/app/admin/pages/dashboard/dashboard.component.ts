import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  ngOnInit(): void {
    this.createDonutChart();
    this.createBarChart();
    this.createLineChart();
  }

  createDonutChart() {
    new Chart('categoryChart', {
      type: 'doughnut',
      data: {
        labels: ['Books', 'Laptops', 'Phones', 'Accessories'],
        datasets: [{
          data: [30, 25, 20, 25],
          backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e'],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom'}
        }
      }
    });
  }

  createBarChart() {
    new Chart('revenueChart', {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
          label: 'Revenue (€)',
          data: [1200, 1900, 3000, 2500, 3200],
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

  }

}
