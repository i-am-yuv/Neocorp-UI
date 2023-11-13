import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-demo-dashboard',
  templateUrl: './demo-dashboard.component.html',
  styleUrls: ['./demo-dashboard.component.scss']
})
export class DemoDashboardComponent implements OnInit {
  data: any;
  options: any;

  constructor() { }

  ngOnInit(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data = {
      labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      datasets: [
        {
          type: 'bar',
          label: 'Collection',
          backgroundColor: documentStyle.getPropertyValue('--blue-400'),
          data: [21, 84, 24, 75, 37, 65, 34, 22, 38, 90]
        },
        {
          type: 'bar',
          label: 'Disburse',
          backgroundColor: documentStyle.getPropertyValue('--gray-300'),
          // backgroundColor: documentStyle.getPropertyValue('color'),
          data: [50, 25, 12, 48, 90, 76, 42, 44, 76, 12]
        }

        // {
        //   type: 'bar',
        //   label: 'Dataset 3',
        //   backgroundColor: documentStyle.getPropertyValue('--yellow-500'),
        //   data: [41, 52, 24, 74, 23, 21, 32]
        // }
      ]
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 2.2,
      plugins: {
        tooltips: {
          mode: 'index',
          intersect: false
        },
        legend: {
          display: false,
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            display: false,
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          stacked: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            // display: false,
            color: surfaceBorder,
            drawBorder: false
          }
        }
      },
      showLines: false,
    };
  }

  allDemoPay: any[] = [
    {
      grossTotal: '10000',
      duedate: '03-11-2023',
      status: 'Partially paid',
      vendor: {
        firstName: 'Praksh',
        lastName: 'Kumar',
      },
    },
    {
      grossTotal: '20000',
      duedate: '05-11-2023',
      status: '5 Days Overdue',
      vendor: {
        firstName: 'Jay',
        lastName: 'Roy',
      },
    },
    {
      grossTotal: '20000',
      duedate: '10-11-2023',
      status: '3 Days Overdue',
      vendor: {
        firstName: 'Dev',
        lastName: 'Kumar',
      },
    },
  ];




}

// function rgbToHex(rgb: any) {
//   // Assuming rgb is in the format 'rgb(r, g, b)'
//   var parts = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
//   delete parts[0];
//   for (var i = 1; i <= 3; ++i) {
//     parts[i] = parseInt(parts[i]).toString(16);
//     if (parts[i].length == 1) parts[i] = '0' + parts[i];
//   }
//   return '#' + parts.join('');
// }

// var hexColor = rgbToHex(backgroundColor);