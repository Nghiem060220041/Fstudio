"use client"

import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface OverviewProps {
  data: any[]
}

export const Overview: React.FC<OverviewProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={data}
        margin={{
          top: 0,
          right: 20,
          left: 50,
          bottom: 0,
        }}
      >
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}`}
        />
        <Tooltip 
          content={({ payload }) => {
            if (payload && payload.length) {
              const { value, name } = payload[0];
              const formattedValue = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
              return (
                <div style={{ backgroundColor: "#fff", padding: "5px 10px", border: "1px solid #ccc" }}>
                  <p className="text-sm">{`Tổng tiền: ${formattedValue} `}</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend/>
        <Bar dataKey="Tổng tiền" fill="#020817" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}