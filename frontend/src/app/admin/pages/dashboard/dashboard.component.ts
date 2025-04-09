import { Component, OnInit } from '@angular/core';

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

  }

  createBarChart() {

  }

  createLineChart() {
    
  }

}
