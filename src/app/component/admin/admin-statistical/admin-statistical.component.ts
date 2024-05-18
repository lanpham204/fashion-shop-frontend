import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../../services/order.service';
import { UserService } from '../../../../services/user.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { log } from 'console';
import { FormsModule } from '@angular/forms';
import { elements } from 'chart.js';
@Component({
  selector: 'app-admin-statistical',
  standalone: true,
  imports: [CommonModule, ChartModule, FormsModule],
  templateUrl: './admin-statistical.component.html',
  styleUrl: './admin-statistical.component.scss'
})
export class AdminStatisticalComponent implements OnInit {
  countUsers: number = 0;
  countOrders: number = 0;
  currentDate: string = '';
  year: string = '';
  month: string = '';
  monthOfYear: any[] = []
  revenueDay: any;
  revenueByYear: [] = [];
  revenueByYearData: any;
  revenueByYearOptions: any;
  revenueByMonth: [] = [];
  revenueByMonthData: any;
  revenueByMonthOptions: any;
  constructor(private orderService: OrderService, private userService: UserService, private datePipe: DatePipe) {
  }
  ngOnInit(): void {
    this.currentDate = this.datePipe.transform(new Date(), "yyyy-MM-dd")!
    this.year = this.datePipe.transform(new Date(), "yyyy")!
    this.month = this.datePipe.transform(new Date(), "yyyy-M")!.toString()
    console.log(this.month);
    
    this.userService.getStatisticalCountUsers().subscribe({
      next: (response: any) => {
        this.countUsers = response
      }
    })
    this.orderService.getCountOrderByDate(this.currentDate).subscribe({
      next: (response: any) => {
        this.countOrders = response
      }
    })
    this.orderService.getRevenueByDate(this.currentDate).subscribe({
      next: (response: any) => {
        this.revenueDay = response[1]
      }
    })
    this.orderService.getMonthOfYear().subscribe({
      next: (response: any) => {
        const data: [] = response
        data.forEach(element => {
          this.monthOfYear.push(element[0]+'-'+element[1])
        })
      }
    })
    this.initRevenueByYear();
    this.initRevenueByMonth()
  }
  initRevenueByYear() {
    this.orderService.getRevenueByYear(this.year).subscribe({
      next: (response: any) => {
        this.revenueByYear = response
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.revenueByYearData = {
          labels: [],
          datasets: [
            {
              label: 'Doanh thu theo năm',
              data: [],
              backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
              borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
              borderWidth: 1
            }
          ]
        };
        this.revenueByYear.forEach((data, index) => {
          this.revenueByYearData.labels.push('Tháng ' + data[0]);
          this.revenueByYearData.datasets[0].data.push(+data[1]);
        });
        this.revenueByYearOptions = {
          plugins: {
            legend: {
              labels: {
                color: textColor
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: textColorSecondary
              },
              grid: {
                color: surfaceBorder,
                drawBorder: false
              }
            },
            x: {
              ticks: {
                color: textColorSecondary
              },
              grid: {
                color: surfaceBorder,
                drawBorder: false
              }
            }
          }
        };
      }
    })

  }
  initRevenueByMonth() {
    this.orderService.getRevenueByMonth(this.month).subscribe({
      next: (response: any) => {
        this.revenueByMonth = response
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.revenueByMonthData = {
          labels: [],
          datasets: [
            {
              label: 'Doanh thu theo tháng',
              data: [],
              backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
              borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
              borderWidth: 1
            }
          ]
        };
        this.revenueByMonth.forEach((data) => {
          this.revenueByMonthData.labels.push('Ngày ' + data[0]);
          this.revenueByMonthData.datasets[0].data.push(data[1]);
        });


        this.revenueByMonthOptions = {
          plugins: {
            legend: {
              labels: {
                color: textColor
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: textColorSecondary
              },
              grid: {
                color: surfaceBorder,
                drawBorder: false
              }
            },
            x: {
              ticks: {
                color: textColorSecondary
              },
              grid: {
                color: surfaceBorder,
                drawBorder: false
              }
            }
          }
        };
      }
    })

  }
  onChangeYear() {
    this.initRevenueByYear()
  }
  onChangeMonth() {
    this.initRevenueByMonth()
  }

}
