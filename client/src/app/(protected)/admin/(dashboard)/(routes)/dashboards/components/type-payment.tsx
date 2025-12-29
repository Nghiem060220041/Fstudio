"use client"

import {
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Title,
    Tooltip
} from "chart.js";
import { Line } from "react-chartjs-2";

interface PaymentChartProps {
    payment: any
}

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

export const PaymentChart: React.FC<PaymentChartProps> = ({ payment }) => {
    const colors = [
      {
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
      },
      {
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.2)',
      },
    ];
    let datasets: any = [];
    payment?.forEach((s:any) => {
        const label = s.label;
        const result = datasets.find((d: any) => d.label === label);
        if (!result) {
          datasets.push({
            fill: true,
            label,
            data: s.data,
          });
        }
      });
    datasets = datasets.map((d: any, i: number) => ({ ...d, ...colors[i] }));
    const labels = [
        'Tháng 1',
        'Tháng 2',
        'Tháng 3',
        'Tháng 4',
        'Tháng 5',
        'Tháng 6',
        'Tháng 7',
        'Tháng 8',
        'Tháng 9',
        'Tháng 10',
        'Tháng 11',
        'Tháng 12',
      ];
    
    const data = {
        labels,
        datasets,
    };
    return (
        <Line
            data={data}
            options={{
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value: any) => {
                        return value.toLocaleString('vi-VN') + 'đ';
                      },
                    },
                  },
                },
            
                interaction: {
                  mode: 'index' as const,
                  intersect: false,
                },
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                    align: 'center' as 'center',
                    labels: {
                      usePointStyle: true,
                      boxHeight: 8,
                    },
                  },
                },
            }}
        />
    );
  }