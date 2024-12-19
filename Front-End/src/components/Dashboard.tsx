import { useEffect, useState } from 'react';
import { LineChart, StatusCard } from './DashboardComponents';
import { ToggleLeft, ToggleRight, Thermometer } from 'lucide-react';
import { ExportPanel } from './ExcelExport';

interface DashboardData {
  timestamp: Date;
  suhu: string;
  temperature: string;
  status_a: boolean;
  status_b: boolean;
}

const WS_URL = "ws://localhost:5500";

export default function Dashboard() {


  const [data, setData] = useState<DashboardData[]>([]);
  const [dataHistory, setDataHistory] = useState<DashboardData[]>([]);
  const [currentData, setCurrentData] = useState<DashboardData | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'on' | 'off'>('all');

  // Fungsi untuk mengambil data historis
  const fetchSensorData = async (): Promise<DashboardData[]> => {
    try {
      const response = await fetch('http://localhost:5500/api/sensors');
      if (!response.ok) throw new Error('Failed to fetch temperature history');

      const result = await response.json();

      return result.data;
    } catch (error) {
      console.error('Error fetching temperature history:', error);
      return [];
    }
  };


  const fetchDataEveryHour = async () => {
    const result = await fetchSensorData();
    setDataHistory(result);
    setDataHistory(prev => [...prev.slice(-200)]);
  };



  const fetchData = async () => {
    const result = await fetchSensorData();

    setDataHistory(result);
    setDataHistory(prev => [...prev.slice(-200)]);

  };

  useEffect(() => {

    fetchData();



    const ws = new WebSocket(WS_URL);

    ws.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      newData.timestamp = new Date(newData.timestamp).toLocaleTimeString()
      setCurrentData(newData);
      setData((prev) => {
        const isDuplicate = prev.some((item) => item.timestamp === newData.timestamp);
        if (!isDuplicate) {
          return [...prev.slice(-20), newData];
        }
        return prev; // Jika duplikat, tidak ada perubahan pada state
      });
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    const interval = setInterval(() => {
      fetchDataEveryHour();
    }, 3600000);

    // Cleanup interval saat komponen di-unmount
    return () => clearInterval(interval);
  }, []);

  const filteredDataHistory = dataHistory.filter(item => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'on') return item.status_a === true && item.status_b === true;
    return item.status_a === false || item.status_b === false;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-full mx-auto">
        <div className='flex justify-between'>
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Real-time Monitoring Dashboard</h1>
          <div className="max-w-fit flex flex-col justify-end">
            <ExportPanel />
          </div>
        </div>
        {/* Current Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatusCard
            title="Suhu"
            value={currentData?.suhu || "0"}
            icon={<Thermometer className="w-6 h-6" />}
            unit="°C"
          />
          <StatusCard
            title="Temperature"
            value={currentData?.temperature || "0"}
            icon={<Thermometer className="w-6 h-6" />}
            unit="°C"
          />
          <StatusCard
            title="Status A"
            value={currentData?.status_a ? "ON" : "OFF"}
            icon={<ToggleLeft className="w-6 h-6" />}
            status={currentData?.status_a ? "success" : "error"}
          />
          <StatusCard
            title="Status B"
            value={currentData?.status_b ? "ON" : "OFF"}
            icon={<ToggleRight className="w-6 h-6" />}
            status={currentData?.status_b ? "success" : "error"}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Real Time Monitoring</h2>
            <LineChart data={data} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Temperature History</h2>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-2 rounded ${statusFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
                  }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('on')}
                className={`px-3 py-2 rounded ${statusFilter === 'on'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700'
                  }`}
              >
                On Only
              </button>
              <button
                onClick={() => setStatusFilter('off')}
                className={`px-3 py-2 rounded ${statusFilter === 'off'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700'
                  }`}
              >
                Off Only
              </button>
            </div>
            <LineChart data={filteredDataHistory} />
          </div>
        </div>
      </div>
    </div>
  );
}