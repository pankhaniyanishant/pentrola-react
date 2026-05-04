import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Navbar from './Navbar';
import Footer from './Footer';
import './Invoice.css';

interface OrderItem {
    title: string;
    qty: number;
    price: number;
    image: string;
    category?: string;
}

interface Order {
    _id: string;
    orderItems: OrderItem[];
    itemsPrice: number;
    shippingPrice: number;
    totalPrice: number;
    status: string;
    createdAt: string;
    shippingAddress?: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    };
    paymentMethod?: string;
    user?: string;
    guestEmail?: string;
}

const Invoice = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!user?.uid) {
                setLoading(false);
                return;
            }
            try {
                const { data } = await api.get(`/orders/user/${user.uid}`);
                const foundOrder = (data || []).find((o: Order) => o._id === id);
                setOrder(foundOrder || null);
            } catch (err) {
                console.error('Error fetching order:', err);
                setOrder(null);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id, user?.uid]);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IN', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const formatPrice = (price: number) => price.toLocaleString('en-IN');

    const getStatusClass = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'delivered': return 'delivered';
            case 'shipped': return 'shipped';
            case 'pending': return 'processing';
            default: return 'processing';
        }
    };

    const printInvoice = () => {
        window.print();
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
                <Navbar />
                <div style={{ textAlign: 'center', padding: '4rem' }}>Loading invoice...</div>
                <Footer />
            </div>
        );
    }

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

    return (
        <div className="invoice-page-wrapper">
            <Navbar />

            <main className="invoice-content-area">
                <div className="invoice-actions no-print">
                    <button className="btn-secondary" onClick={() => navigate('/orders')}>&larr; Back to Orders</button>
                    <button className="btn-primary" onClick={printInvoice}>Print / Save as PDF</button>
                </div>

                <div className="invoice-card" id="printable-invoice">
                    <header className="invoice-header">
                        <div className="brand-section">
                            <h1 className="brand-name">PANTROLA</h1>
                            <p className="tagline">Premium Educational Toys for Creative Minds</p>
                        </div>
                        <div className="invoice-title">
                            <h2>TAX INVOICE</h2>
                        </div>
                    </header>

                    <section className="invoice-meta">
                        <div className="meta-left">
                            <h3>Billed To:</h3>
                            <p><strong>{user?.displayName || 'Valuable Customer'}</strong></p>
                            <p>Email: {user?.email || order.guestEmail || 'N/A'}</p>
                            {order.shippingAddress && (
                                <p>Address: {order.shippingAddress.address}, {order.shippingAddress.city}</p>
                            )}
                        </div>
                        <div className="meta-right">
                            <div className="meta-item">
                                <span>Order ID:</span>
                                <strong>{order._id}</strong>
                            </div>
                            <div className="meta-item">
                                <span>Date:</span>
                                <strong>{formatDate(order.createdAt)}</strong>
                            </div>
                            <div className="meta-item">
                                <span>Status:</span>
                                <span className={`status-badge status-${getStatusClass(order.status)}`}>{order.status}</span>
                            </div>
                        </div>
                    </section>

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
                                {order.orderItems.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>{item.title}</td>
                                        <td className="text-center">{item.qty}</td>
                                        <td className="text-center">₹{formatPrice(item.price)}</td>
                                        <td className="text-right">₹{formatPrice(item.qty * item.price)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>

                    <section className="invoice-summary">
                        <div className="summary-spacer"></div>
                        <div className="summary-details">
                            <div className="summary-row">
                                <span>Subtotal:</span>
                                <span>₹{formatPrice(order.itemsPrice)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping:</span>
                                <span>{order.shippingPrice === 0 ? 'FREE' : `₹${formatPrice(order.shippingPrice)}`}</span>
                            </div>
                            <div className="summary-row total">
                                <span>Grand Total:</span>
                                <strong>₹{formatPrice(order.totalPrice)}</strong>
                            </div>
                        </div>
                    </section>

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
