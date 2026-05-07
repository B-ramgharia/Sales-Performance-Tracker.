import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { DollarSign, Package, BarChart3, TrendingUp, Calendar, ArrowUpRight } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await client.get('/dashboard');
      setData(res.data);
    } catch (err) {
      console.error('Error fetching dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[calc(100-64px)] py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
    </div>
  );

  const { kpis, charts, recent_sales } = data || { kpis: {}, charts: {}, recent_sales: [] };

  const lineData = {
    labels: charts.revenue_trends?.map(i => i.sale_date) || [],
    datasets: [{
      label: 'Monthly Revenue',
      data: charts.revenue_trends?.map(i => i.total) || [],
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
    }]
  };

  const barData = {
    labels: charts.category_breakdown?.map(i => i.category) || [],
    datasets: [{
      label: 'Revenue by Category',
      data: charts.category_breakdown?.map(i => i.total) || [],
      backgroundColor: ['#0F172A', '#10B981', '#3B82F6', '#6366F1', '#F59E0B'],
      borderRadius: 8,
    }]
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-primary">Executive Dashboard</h1>
          <p className="text-gray-500">Real-time performance metrics and predictive insights.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600">
          <Calendar size={16} />
          {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard 
          title="Total Revenue" 
          value={`$${kpis.total_revenue?.toLocaleString()}`} 
          icon={<DollarSign className="text-accent" />} 
          trend="+12.5%"
        />
        <KPICard 
          title="Units Sold" 
          value={kpis.total_units?.toLocaleString()} 
          icon={<Package className="text-secondary" />} 
          trend="+5.2%"
        />
        <KPICard 
          title="Avg. Order Value" 
          value={`$${kpis.avg_order_value?.toLocaleString()}`} 
          icon={<BarChart3 className="text-primary" />} 
          trend="-2.1%"
          isNegative={true}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-accent" />
            Revenue Trends
          </h3>
          <div className="h-[300px]">
            <Line data={lineData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <BarChart3 size={20} className="text-secondary" />
            Category Performance
          </h3>
          <div className="h-[300px]">
            <Bar data={barData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-lg">Recent Transactions</h3>
          <button className="text-accent text-sm font-bold hover:underline">View All Report</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Product</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Quantity</th>
                <th className="px-6 py-4 font-semibold text-right">Amount</th>
                <th className="px-6 py-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recent_sales.map((sale, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-primary">{sale.product_name}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">
                      {sale.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{sale.quantity}</td>
                  <td className="px-6 py-4 text-right font-bold text-primary">${sale.total?.toFixed(2)}</td>
                  <td className="px-6 py-4 text-slate-400 text-sm">
                    {new Date(sale.sale_date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {recent_sales.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400 italic">
                    No data available. Please upload a file to see analytics.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const KPICard = ({ title, value, icon, trend, isNegative }) => (
  <div className="glass-card p-6 rounded-2xl flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-primary">{value}</h3>
      <div className={`flex items-center gap-1 mt-2 text-xs font-bold ${isNegative ? 'text-red-500' : 'text-secondary'}`}>
        <ArrowUpRight size={14} className={isNegative ? 'rotate-90' : ''} />
        {trend}
        <span className="text-gray-400 font-normal ml-1">vs last month</span>
      </div>
    </div>
    <div className="p-4 bg-slate-50 rounded-2xl">
      {icon}
    </div>
  </div>
);

export default Dashboard;
