"use client"

import {
    ArcElement,
    Chart as ChartJS,
    Legend,
    Title,
    Tooltip
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

interface OrderChartProps {
    order: any
}

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export const OrderChart: React.FC<OrderChartProps> = ({ order }) => {
    const labels = order.map((item: any) => item.status);
    const data = order.map((item: any) => item.totalOrder);

    const chartData = {
        labels: labels,
        datasets: [{
            data: data,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)'
            ],
            borderWidth: 1,
            hoverBorderWidth: 2,
            hoverBorderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)'
            ],
        }]
    };
    return (
        <Doughnut
            data={chartData}
            options={{
                plugins: {
                  legend: {
                    position: 'bottom',
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