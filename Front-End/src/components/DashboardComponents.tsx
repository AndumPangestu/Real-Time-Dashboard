import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface StatusCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  unit?: string;
  status?: 'success' | 'error';
}

export const StatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  icon,
  unit,
  status
}) => {
  const getStatusColor = () => {
    if (!status) return 'bg-blue-50 text-blue-700';
    return status === 'success'
      ? 'bg-green-50 text-green-700'
      : 'bg-red-50 text-red-700';
  };

  return (
    <div className={`p-6 rounded-lg shadow ${getStatusColor()}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-2xl font-bold mt-1">
            {value}{unit && <span className="text-lg ml-1">{unit}</span>}
          </p>
        </div>
        <div className="opacity-80">{icon}</div>
      </div>
    </div>
  );
};

interface LineChartProps {
  data: any[];
}

export const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map(d => d.timestamp),
    datasets: [
      {
        label: 'Suhu',
        data: data.map(d => parseFloat(d.suhu)),
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.1,
      },
      {
        label: 'Temperature',
        data: data.map(d => parseFloat(d.temperature)),
        borderColor: 'rgb(239, 68, 68)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};
