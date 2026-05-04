import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Navbar from './Navbar';
import Footer from './Footer';
import './OrderHistory.css';

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
}

const OrderHistory = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const { user, isLoggedIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user?.uid) {
                setLoading(false);
                return;
            }
            try {
                const { data } = await api.get(`/orders/user/${user.uid}`);
                setOrders(data || []);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user?.uid]);

    const closeModal = () => setSelectedOrder(null);

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

    const generateInvoicePDF = (order: Order) => {
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
        doc.text('Premium Educational Toys for Creative Minds', 105, 32, { align: 'center' });

        doc.setFontSize(24);
        doc.setTextColor(255, 255, 255);
        doc.text('INVOICE', 190, 28, { align: 'right' });

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('BILL TO:', 20, 60);
        doc.setFont('helvetica', 'normal');
        doc.text(user?.displayName || 'Valuable Customer', 20, 66);
        doc.text(`Email: ${user?.email || ''}`, 20, 72);

        doc.setFont('helvetica', 'bold');
        doc.text('ORDER DETAILS:', 140, 60);
        doc.setFont('helvetica', 'normal');
        doc.text(`Order ID: ${order._id}`, 140, 66);
        doc.text(`Date: ${formatDate(order.createdAt)}`, 140, 72);
        doc.text(`Status: ${order.status}`, 140, 78);

        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.rect(20, 95, 170, 10, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text('Item Description', 25, 101);
        doc.text('Qty', 130, 101, { align: 'center' });
        doc.text('Price', 155, 101, { align: 'center' });
        doc.text('Total', 185, 101, { align: 'right' });

        doc.setTextColor(50, 50, 50);
        doc.setFont('helvetica', 'normal');
        let currentY = 112;
        order.orderItems.forEach((item, index) => {
            if (index % 2 === 0) {
                doc.setFillColor(252, 252, 252);
                doc.rect(20, currentY - 6, 170, 10, 'F');
            }
            doc.text(item.title, 25, currentY);
            doc.text(item.qty.toString(), 130, currentY, { align: 'center' });
            doc.text(`Rs. ${item.price}`, 155, currentY, { align: 'center' });
            doc.text(`Rs. ${item.qty * item.price}`, 185, currentY, { align: 'right' });
            doc.setDrawColor(240, 240, 240);
            doc.line(20, currentY + 4, 190, currentY + 4);
            currentY += 10;
        });

        currentY += 10;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Subtotal:', 140, currentY);
        doc.text(`Rs. ${order.itemsPrice}`, 185, currentY, { align: 'right' });

        currentY += 8;
        doc.text('Shipping:', 140, currentY);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text(order.shippingPrice === 0 ? 'FREE' : `Rs. ${order.shippingPrice}`, 185, currentY, { align: 'right' });

        currentY += 10;
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.rect(135, currentY - 7, 55, 10, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text('TOTAL:', 140, currentY);
        doc.text(`Rs. ${order.totalPrice}`, 185, currentY, { align: 'right' });

        doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        doc.rect(0, 275, 210, 22, 'F');

        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text('THANK YOU FOR YOUR BUSINESS!', 105, 283, { align: 'center' });

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(180, 180, 180);
        doc.text('For support, contact us at support@pantrola.com', 105, 288, { align: 'center' });
        doc.text('www.pantrola.com', 105, 292, { align: 'center' });

        return doc;
    };

    const handleDownloadInvoice = (order: Order) => {
        const doc = generateInvoicePDF(order);
        doc.save(`Invoice_${order._id}.pdf`);
    };

    const handleViewInvoice = (order: Order) => {
        navigate(`/invoice/${order._id}`);
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
                <Navbar />
                <main className="order-history-container">
                    <div style={{ textAlign: 'center', padding: '4rem' }}>Loading orders...</div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!isLoggedIn || orders.length === 0) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
                <Navbar />
                <main className="order-history-container">
                    <header className="order-history-header">
                        <h1>My Order History</h1>
                        <p>Track and manage your recent purchases</p>
                    </header>
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <p>No orders found. Start shopping to see your orders here!</p>
                        <button className="btn-primary" onClick={() => navigate('/products')} style={{ marginTop: '1rem' }}>
                            Browse Products
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
            <Navbar />
            <main className="order-history-container">
                <header className="order-history-header">
                    <h1>My Order History</h1>
                    <p>Track and manage your recent purchases</p>
                </header>

                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order._id} className="order-card">
                            <div className="order-card-header">
                                <div className="order-info">
                                    <span className="order-id">{order._id}</span>
                                    <span className="order-date">{formatDate(order.createdAt)}</span>
                                </div>
                                <div className={`order-status status-${getStatusClass(order.status)}`}>
                                    {order.status}
                                </div>
                            </div>

                            <div className="order-items">
                                {order.orderItems.map((item, idx) => (
                                    <div key={idx} className="order-item">
                                        <img src={item.image} alt={item.title} className="item-image" />
                                        <div className="item-details">
                                            <span className="item-name">{item.title}</span>
                                            <span className="item-qty">Qty: {item.qty}</span>
                                        </div>
                                        <span className="item-price">₹{formatPrice(item.price * item.qty)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="order-card-footer">
                                <div className="order-total">
                                    <span>Total Amount:</span>
                                    <strong>₹{formatPrice(order.totalPrice)}</strong>
                                </div>
                                <div className="order-actions">
                                    <button className="btn-secondary" onClick={() => setSelectedOrder(order)}>View Details</button>
                                    <button className="btn-secondary" onClick={() => handleViewInvoice(order)}>View Invoice</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {selectedOrder && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="order-details-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Order Details</h2>
                            <button className="close-modal-btn" onClick={closeModal}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-section">
                                <h3>Order Summary</h3>
                                <div className="detail-row">
                                    <span>Order ID:</span>
                                    <strong>{selectedOrder._id}</strong>
                                </div>
                                <div className="detail-row">
                                    <span>Order Date:</span>
                                    <strong>{formatDate(selectedOrder.createdAt)}</strong>
                                </div>
                                <div className="detail-row">
                                    <span>Status:</span>
                                    <span className={`status-badge status-${getStatusClass(selectedOrder.status)}`}>
                                        {selectedOrder.status}
                                    </span>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h3>Items Purchased</h3>
                                <div className="modal-items-list">
                                    {selectedOrder.orderItems.map((item, idx) => (
                                        <div key={idx} className="modal-item">
                                            <img src={item.image} alt={item.title} />
                                            <div className="modal-item-info">
                                                <span className="modal-item-name">{item.title}</span>
                                                <span className="modal-item-qty">Qty: {item.qty} x ₹{formatPrice(item.price)}</span>
                                            </div>
                                            <span className="modal-item-total">₹{formatPrice(item.qty * item.price)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="detail-section payment-info">
                                <h3>Payment Details</h3>
                                <div className="detail-row">
                                    <span>Subtotal:</span>
                                    <span>₹{formatPrice(selectedOrder.itemsPrice)}</span>
                                </div>
                                <div className="detail-row">
                                    <span>Shipping:</span>
                                    <span>{selectedOrder.shippingPrice === 0 ? 'FREE' : `₹${formatPrice(selectedOrder.shippingPrice)}`}</span>
                                </div>
                                <div className="detail-row total">
                                    <span>Total:</span>
                                    <strong>₹{formatPrice(selectedOrder.totalPrice)}</strong>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={closeModal}>Close</button>
                            <button className="btn-secondary" onClick={() => handleViewInvoice(selectedOrder)}>View Invoice</button>
                            <button className="btn-primary" onClick={() => handleDownloadInvoice(selectedOrder)}>Download Invoice</button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default OrderHistory;
