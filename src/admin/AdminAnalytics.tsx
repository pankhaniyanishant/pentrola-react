import { useState, useEffect } from 'react';
import './AdminDashboard.css';

// SVG Icons
const IconTrendingUp = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>;
const IconUsers = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const IconShoppingBag = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>;
const IconDollarSign = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12"></path><path d="M6 8h12"></path><path d="m6 13 8.5 8"></path><path d="M6 13h3"></path><path d="M9 13c6.667 0 6.667-10 0-10"></path></svg>;

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [isDownloading, setIsDownloading] = useState(false);
  const [salesData, setSalesData] = useState([
    { month: 'Jan', sales: 4500 },
    { month: 'Feb', sales: 5200 },
    { month: 'Mar', sales: 4800 },
    { month: 'Apr', sales: 6100 },
    { month: 'May', sales: 5900 },
    { month: 'Jun', sales: 7200 },
  ]);

  useEffect(() => {
    // Simulate data change based on time range
    const multiplier = timeRange === '24h' ? 0.1 : timeRange === '30d' ? 1.5 : timeRange === '90d' ? 3.5 : 1;
    setSalesData([
      { month: 'Jan', sales: Math.floor(4500 * multiplier) },
      { month: 'Feb', sales: Math.floor(5200 * multiplier) },
      { month: 'Mar', sales: Math.floor(4800 * multiplier) },
      { month: 'Apr', sales: Math.floor(6100 * multiplier) },
      { month: 'May', sales: Math.floor(5900 * multiplier) },
      { month: 'Jun', sales: Math.floor(7200 * multiplier) },
    ]);
  }, [timeRange]);

  const maxSales = Math.max(...salesData.map(d => d.sales), 1);

  const topProducts = [
    { name: 'Red T-Shirt', sales: 450, growth: '+12%' },
    { name: 'Blue Jeans', sales: 320, growth: '+8%' },
    { name: 'Wireless Mouse', sales: 280, growth: '+15%' },
    { name: 'Coffee Mug', sales: 210, growth: '-3%' },
  ];

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      alert('Analytics report has been generated and downloaded.');
    }, 1500);
  };

  return (
    <div className="admin-content-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Analytics</h2>
          <p className="page-subtitle">Deep dive into your store performance</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="form-select"
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #E5E7EB', outline: 'none', background: 'white' }}
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button className="btn-add-product" onClick={handleDownload} disabled={isDownloading}>
            {isDownloading ? 'Preparing...' : 'Download Report'}
          </button>
        </div>
      </div>

      {/* Analytics Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="data-card" style={{ padding: '1.5rem', marginBottom: 0, borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ color: '#6B7280', fontSize: '0.875rem', fontWeight: 600 }}>Gross Sales</span>
            <div style={{ background: '#ECFDF5', color: '#10B981', padding: '6px', borderRadius: '6px' }}><IconDollarSign /></div>
          </div>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 700 }}>₹{(124560 * (timeRange === '24h' ? 0.05 : timeRange === '30d' ? 1.2 : 1)).toLocaleString()}</h3>
          <p style={{ color: '#10B981', fontSize: '0.875rem', marginTop: '5px', fontWeight: 600 }}>+12.3% <span style={{ color: '#9CA3AF', fontWeight: 400 }}>vs last period</span></p>
        </div>

        <div className="data-card" style={{ padding: '1.5rem', marginBottom: 0, borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ color: '#6B7280', fontSize: '0.875rem', fontWeight: 600 }}>Total Orders</span>
            <div style={{ background: '#EEF2FF', color: '#4F46E5', padding: '6px', borderRadius: '6px' }}><IconShoppingBag /></div>
          </div>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{Math.floor(856 * (timeRange === '24h' ? 0.05 : timeRange === '30d' ? 1.2 : 1))}</h3>
          <p style={{ color: '#10B981', fontSize: '0.875rem', marginTop: '5px', fontWeight: 600 }}>+5.7% <span style={{ color: '#9CA3AF', fontWeight: 400 }}>vs last period</span></p>
        </div>

        <div className="data-card" style={{ padding: '1.5rem', marginBottom: 0, borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ color: '#6B7280', fontSize: '0.875rem', fontWeight: 600 }}>Store Visits</span>
            <div style={{ background: '#FEF3C7', color: '#D97706', padding: '6px', borderRadius: '6px' }}><IconUsers /></div>
          </div>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{Math.floor(12450 * (timeRange === '24h' ? 0.05 : timeRange === '30d' ? 1.2 : 1)).toLocaleString()}</h3>
          <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '5px', fontWeight: 600 }}>-2.1% <span style={{ color: '#9CA3AF', fontWeight: 400 }}>vs last period</span></p>
        </div>

        <div className="data-card" style={{ padding: '1.5rem', marginBottom: 0, borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ color: '#6B7280', fontSize: '0.875rem', fontWeight: 600 }}>Conversion Rate</span>
            <div style={{ background: '#FCE7F3', color: '#DB2777', padding: '6px', borderRadius: '6px' }}><IconTrendingUp /></div>
          </div>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 700 }}>6.8%</h3>
          <p style={{ color: '#10B981', fontSize: '0.875rem', marginTop: '5px', fontWeight: 600 }}>+0.4% <span style={{ color: '#9CA3AF', fontWeight: 400 }}>vs last period</span></p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {/* Sales Chart (CSS Based) */}
        <div className="data-card" style={{ padding: '2rem', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '2rem', color: '#111827' }}>Monthly Sales Revenue</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '250px', paddingBottom: '30px', borderBottom: '2px solid #F3F4F6' }}>
            {salesData.map((data, index) => (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '12%', height: '100%', justifyContent: 'flex-end', position: 'relative' }}>
                <div
                  title={`₹${data.sales}`}
                  style={{
                    width: '100%',
                    height: `${(data.sales / maxSales) * 100}%`,
                    background: 'linear-gradient(to top, #4F46E5, #818CF8)',
                    borderRadius: '6px 6px 0 0',
                    transition: 'height 0.5s ease-out',
                    cursor: 'pointer'
                  }}
                />
                <span style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '12px', fontWeight: 600 }}>{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="data-card" style={{ padding: '2rem', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', margin: 0 }}>Top Selling Products</h3>
            <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 600 }}>By Sales Volume</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {topProducts.map((product, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#4B5563', fontSize: '0.875rem' }}>
                    {index + 1}
                  </div>
                  <div>
                    <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#111827', margin: 0 }}>{product.name}</p>
                    <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>{product.sales} units sold</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 8px',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: product.growth.startsWith('+') ? '#DCFCE7' : '#FEE2E2',
                    color: product.growth.startsWith('+') ? '#15803D' : '#B91C1C'
                  }}>
                    {product.growth}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button style={{ width: '100%', marginTop: '2rem', padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', background: 'white', color: '#374151', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
            View Detailed Inventory
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
