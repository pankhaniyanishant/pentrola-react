import { useEffect, useState } from 'react';
import './AdminDashboard.css';
import { getAnalytics, type AnalyticsData } from '../services/adminApi';
import { getApiErrorMessage } from '../services/api';
import { jsPDF } from 'jspdf';

// SVG Icons
const IconTrendingUp = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>;
const IconUsers = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const IconShoppingBag = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>;
const IconDollarSign = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12"></path><path d="M6 8h12"></path><path d="m6 13 8.5 8"></path><path d="M6 13h3"></path><path d="M9 13c6.667 0 6.667-10 0-10"></path></svg>;

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [isDownloading, setIsDownloading] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getAnalytics(timeRange);
        setAnalytics(data);
      } catch (err) {
        setError(getApiErrorMessage(err, 'Failed to load analytics'));
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [timeRange]);

  const handleDownload = () => {
    if (!analytics) return;
    
    setIsDownloading(true);
    
    const doc = new jsPDF();
    const primaryColor = [255, 77, 77];
    const secondaryColor = [33, 37, 41];
    
    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.rect(0, 0, 210, 45, 'F');
    
    doc.setFontSize(28);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('PANTROLA', 105, 25, { align: 'center' });
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(200, 200, 200);
    doc.text('Analytics Report', 105, 32, { align: 'center' });
    
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text('STORE ANALYTICS', 190, 28, { align: 'right' });
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Report Period', 20, 60);
    doc.setFont('helvetica', 'normal');
    const periodLabels: Record<string, string> = { '24h': 'Last 24 Hours', '7d': 'Last 7 Days', '30d': 'Last 30 Days', '90d': 'Last 90 Days' };
    doc.text(`Period: ${periodLabels[timeRange] || timeRange}`, 20, 68);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`, 20, 76);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Key Metrics', 20, 95);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`Gross Sales: ${formatCurrency(analytics.grossSales)}`, 20, 103);
    doc.text(`Total Orders: ${analytics.totalOrders}`, 20, 111);
    doc.text(`Total Customers: ${analytics.totalCustomers}`, 20, 119);
    doc.text(`Avg Order Value: ${formatCurrency(analytics.averageOrderValue)}`, 20, 127);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Growth Metrics', 20, 150);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`Sales Growth: ${analytics.salesGrowth >= 0 ? '+' : ''}${analytics.salesGrowth}% vs last period`, 20, 158);
    doc.text(`Orders Growth: ${analytics.ordersGrowth >= 0 ? '+' : ''}${analytics.ordersGrowth}% vs last period`, 20, 166);
    doc.text(`Customers Growth: ${analytics.customersGrowth >= 0 ? '+' : ''}${analytics.customersGrowth}% vs last period`, 20, 174);
    doc.text(`Avg Order Value Growth: ${analytics.aovGrowth >= 0 ? '+' : ''}${analytics.aovGrowth}% vs last period`, 20, 182);
    
    const chartY = 205;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Monthly Sales Revenue', 20, chartY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(20, chartY + 8, 170, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text('Month', 25, chartY + 14);
    doc.text('Revenue', 170, chartY + 14, { align: 'right' });
    
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'normal');
    let currentY = chartY + 22;
    
    analytics.salesChart.forEach((data) => {
      if (currentY > 270) {
        doc.addPage();
        currentY = 20;
      }
      doc.text(data.month, 25, currentY);
      doc.text(formatCurrency(data.sales), 170, currentY, { align: 'right' });
      currentY += 8;
    });
    
    if (analytics.topProducts.length > 0) {
      const productsY = currentY + 10;
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.text('Top Selling Products', 20, productsY);
      
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(20, productsY + 8, 170, 10, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.text('Product', 25, productsY + 14);
      doc.text('Units Sold', 170, productsY + 14, { align: 'right' });
      
      doc.setTextColor(50, 50, 50);
      doc.setFont('helvetica', 'normal');
      currentY = productsY + 22;
      
      analytics.topProducts.forEach((product) => {
        if (currentY > 270) {
          doc.addPage();
          currentY = 20;
        }
        doc.text(product.name.substring(0, 30), 25, currentY);
        doc.text(String(product.sales), 170, currentY, { align: 'right' });
        currentY += 8;
      });
    }
    
    const pageCount = doc.getNumberOfPages();
    for (let i = 2; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
    }
    
    doc.save(`analytics-report-${new Date().toISOString().split('T')[0]}.pdf`);
    setIsDownloading(false);
  };

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

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
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#EF4444' }}>{error}</div>
      ) : analytics && (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="data-card" style={{ padding: '1.5rem', marginBottom: 0, borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ color: '#6B7280', fontSize: '0.875rem', fontWeight: 600 }}>Gross Sales</span>
            <div style={{ background: '#ECFDF5', color: '#10B981', padding: '6px', borderRadius: '6px' }}><IconDollarSign /></div>
          </div>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{formatCurrency(analytics.grossSales)}</h3>
          <p style={{ color: analytics.salesGrowth >= 0 ? '#10B981' : '#EF4444', fontSize: '0.875rem', marginTop: '5px', fontWeight: 600 }}>{analytics.salesGrowth >= 0 ? '+' : ''}{analytics.salesGrowth}% <span style={{ color: '#9CA3AF', fontWeight: 400 }}>vs last period</span></p>
        </div>

        <div className="data-card" style={{ padding: '1.5rem', marginBottom: 0, borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ color: '#6B7280', fontSize: '0.875rem', fontWeight: 600 }}>Total Orders</span>
            <div style={{ background: '#EEF2FF', color: '#4F46E5', padding: '6px', borderRadius: '6px' }}><IconShoppingBag /></div>
          </div>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{analytics.totalOrders}</h3>
          <p style={{ color: analytics.ordersGrowth >= 0 ? '#10B981' : '#EF4444', fontSize: '0.875rem', marginTop: '5px', fontWeight: 600 }}>{analytics.ordersGrowth >= 0 ? '+' : ''}{analytics.ordersGrowth}% <span style={{ color: '#9CA3AF', fontWeight: 400 }}>vs last period</span></p>
        </div>

        <div className="data-card" style={{ padding: '1.5rem', marginBottom: 0, borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ color: '#6B7280', fontSize: '0.875rem', fontWeight: 600 }}>Total Customers</span>
            <div style={{ background: '#FEF3C7', color: '#D97706', padding: '6px', borderRadius: '6px' }}><IconUsers /></div>
          </div>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{analytics.totalCustomers}</h3>
          <p style={{ color: analytics.customersGrowth >= 0 ? '#10B981' : '#EF4444', fontSize: '0.875rem', marginTop: '5px', fontWeight: 600 }}>{analytics.customersGrowth >= 0 ? '+' : ''}{analytics.customersGrowth}% <span style={{ color: '#9CA3AF', fontWeight: 400 }}>vs last period</span></p>
        </div>

        <div className="data-card" style={{ padding: '1.5rem', marginBottom: 0, borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ color: '#6B7280', fontSize: '0.875rem', fontWeight: 600 }}>Avg Order Value</span>
            <div style={{ background: '#FCE7F3', color: '#DB2777', padding: '6px', borderRadius: '6px' }}><IconTrendingUp /></div>
          </div>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{formatCurrency(analytics.averageOrderValue)}</h3>
          <p style={{ color: analytics.aovGrowth >= 0 ? '#10B981' : '#EF4444', fontSize: '0.875rem', marginTop: '5px', fontWeight: 600 }}>{analytics.aovGrowth >= 0 ? '+' : ''}{analytics.aovGrowth}% <span style={{ color: '#9CA3AF', fontWeight: 400 }}>vs last period</span></p>
        </div>
      </div>
      )}

      {analytics && (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {/* Sales Chart (CSS Based) */}
        <div className="data-card" style={{ padding: '2rem', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '2rem', color: '#111827' }}>Monthly Sales Revenue</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '250px', paddingBottom: '30px', borderBottom: '2px solid #F3F4F6' }}>
            {(() => {
              const maxSales = Math.max(...analytics.salesChart.map(d => d.sales), 1);
              return analytics.salesChart.map((data, index) => (
                <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '12%', height: '100%', justifyContent: 'flex-end', position: 'relative' }}>
                  <div
                    title={formatCurrency(data.sales)}
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
              ));
            })()}
          </div>
        </div>

        {/* Top Products */}
        <div className="data-card" style={{ padding: '2rem', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', margin: 0 }}>Top Selling Products</h3>
            <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 600 }}>By Sales Volume</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {analytics.topProducts.map((product, index) => (
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
                    background: product.growth >= 0 ? '#DCFCE7' : '#FEE2E2',
                    color: product.growth >= 0 ? '#15803D' : '#B91C1C'
                  }}>
                    {product.growth >= 0 ? '+' : ''}{product.growth}%
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
      )}
    </div>
  );
};

export default AdminAnalytics;
