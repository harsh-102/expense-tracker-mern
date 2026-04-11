import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Analytics = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/analytics');
      setData(res.data.categoryTotals);
    } catch (err) {
      console.error(err);
    }
  }

  const chartData = {
    labels: data ? Object.keys(data) : [],
    datasets: [
      {
        label: 'Spending by Category ($)',
        data: data ? Object.values(data) : [],
        backgroundColor: [
          '#472950',
          '#D46A79',
          '#C0A4C4',
          '#F6CBB6',
          '#78201B',
          '#4CAF50',
          '#FF9800',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Analytics & Insights</h1>
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h3>Expense Breakdown by Category</h3>
        {data && Object.keys(data).length > 0 ? (
          <div style={{ marginTop: '2rem' }}>
            <Pie data={chartData} />
          </div>
        ) : (
          <p style={{ marginTop: '2rem', color: '#666' }}>No data available to plot yet.</p>
        )}
      </div>
    </div>
  );
};

export default Analytics;
