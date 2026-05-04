import { useParams, useNavigate } from 'react-router-dom';
import { ORDERS } from './OrderHistory';
import Navbar from './Navbar';
import Footer from './Footer';
import './Invoice.css';

const Invoice = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const order = ORDERS.find(o => o.id === id);

    if (!order) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
                <Navbar />
                <div className="invoice-not-found">
                    <h2>Invoice Not Found</h2>
                    <p>The order you are looking for does not exist.</p>
                    <button className="btn-primary" onClick={() => navigate('/orders')}>Back to Orders</button>
                </div>
                <Footer />
            </div>
        );
    }

    const printInvoice = () => {
        window.print();
    };

    return (
        <div className="invoice-page-wrapper">
            <Navbar />

            <main className="invoice-content-area">
                <div className="invoice-actions no-print">
                    <button className="btn-secondary" onClick={() => navigate('/orders')}>&larr; Back to Orders</button>
                    <button className="btn-primary" onClick={printInvoice}>Print / Save as PDF</button>
                </div>

                <div className="invoice-card" id="printable-invoice">
                    {/* Invoice Header */}
                    <header className="invoice-header">
                        <div className="brand-section">
                            <h1 className="brand-name">PANTROLA</h1>
                            <p className="tagline">Premium Educational Toys for Creative Minds</p>
                        </div>
                        <div className="invoice-title">
                            <h2>TAX INVOICE</h2>
                        </div>
                    </header>

                    {/* Order Meta Data */}
                    <section className="invoice-meta">
                        <div className="meta-left">
                            <h3>Billed To:</h3>
                            <p><strong>Valuable Customer</strong></p>
                            <p>Email: user@example.com</p>
                            <p>Address: 123, Toy Street, Play City</p>
                        </div>
                        <div className="meta-right">
                            <div className="meta-item">
                                <span>Order ID:</span>
                                <strong>{order.id}</strong>
                            </div>
                            <div className="meta-item">
                                <span>Date:</span>
                                <strong>{order.date}</strong>
                            </div>
                            <div className="meta-item">
                                <span>Status:</span>
                                <span className={`status-badge status-${order.status.toLowerCase()}`}>{order.status}</span>
                            </div>
                        </div>
                    </section>

                    {/* Items Table */}
                    <section className="invoice-items">
                        <table className="invoice-table">
                            <thead>
                                <tr>
                                    <th>Item Description</th>
                                    <th className="text-center">Qty</th>
                                    <th className="text-center">Price</th>
                                    <th className="text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>{item.name}</td>
                                        <td className="text-center">{item.quantity}</td>
                                        <td className="text-center">₹{item.price}</td>
                                        <td className="text-right">₹{item.quantity * item.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>

                    {/* Summary Section */}
                    <section className="invoice-summary">
                        <div className="summary-spacer"></div>
                        <div className="summary-details">
                            <div className="summary-row">
                                <span>Subtotal:</span>
                                <span>₹{order.total}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping:</span>
                                <span className="free-text">FREE</span>
                            </div>
                            <div className="summary-row total">
                                <span>Grand Total:</span>
                                <strong>₹{order.total}</strong>
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="invoice-footer-content">
                        <p>Thank you for shopping with Pantrola!</p>
                        <p>For any queries, please contact at <strong>support@pantrola.com</strong></p>
                        <div className="footer-links">
                            <span>www.pantrola.com</span>
                        </div>
                    </footer>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Invoice;
