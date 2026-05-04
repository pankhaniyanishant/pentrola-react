import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import Navbar from './Navbar';
import Footer from './Footer';
import './OrderHistory.css';

export const ORDERS = [
    {
        id: 'ORD-2024-001',
        date: 'March 15, 2024',
        status: 'Delivered',
        total: 1250,
        items: [
            { name: 'Wooden Xylophone', quantity: 1, price: 850, image: '/hero-xylophone.png' },
            { name: 'Animal Puzzle Set', quantity: 1, price: 400, image: '/cat-toys.png' }
        ]
    },
    {
        id: 'ORD-2024-002',
        date: 'March 10, 2024',
        status: 'Shipped',
        total: 2100,
        items: [
            { name: 'Educational Building Blocks', quantity: 1, price: 2100, image: '/educational-toys.png' }
        ]
    },
    {
        id: 'ORD-2024-003',
        date: 'March 05, 2024',
        status: 'Processing',
        total: 950,
        items: [
            { name: 'Smart Sequence Game', quantity: 1, price: 950, image: '/smart-sequence.png' }
        ]
    }
];

const OrderHistory = () => {
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const navigate = useNavigate();

    const closeModal = () => setSelectedOrder(null);

    const generateInvoicePDF = (order: any) => {
        const doc = new jsPDF();

        // Colors
        const primaryColor = [255, 77, 77]; // Pentrola Red
        const secondaryColor = [33, 37, 41]; // Dark Charcoal

        // Header Background
        doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        doc.rect(0, 0, 210, 45, 'F');

        // Company Brand
        doc.setFontSize(28);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text('PANTROLA', 105, 25, { align: 'center' });

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(200, 200, 200);
        doc.text('Premium Educational Toys for Creative Minds', 105, 32, { align: 'center' });

        // Invoice Title
        doc.setFontSize(24);
        doc.setTextColor(255, 255, 255);
        doc.text('INVOICE', 190, 28, { align: 'right' });

        // Order Info Section
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('BILL TO:', 20, 60);
        doc.setFont('helvetica', 'normal');
        doc.text('Valuable Customer', 20, 66);
        doc.text('Email: user@example.com', 20, 72);

        doc.setFont('helvetica', 'bold');
        doc.text('ORDER DETAILS:', 140, 60);
        doc.setFont('helvetica', 'normal');
        doc.text(`Order ID: ${order.id}`, 140, 66);
        doc.text(`Date: ${order.date}`, 140, 72);
        doc.text(`Status: ${order.status}`, 140, 78);

        // Table Header
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.rect(20, 95, 170, 10, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text('Item Description', 25, 101);
        doc.text('Qty', 130, 101, { align: 'center' });
        doc.text('Price', 155, 101, { align: 'center' });
        doc.text('Total', 185, 101, { align: 'right' });

        // Table Content
        doc.setTextColor(50, 50, 50);
        doc.setFont('helvetica', 'normal');
        let currentY = 112;
        order.items.forEach((item: any, index: number) => {
            // Zebra Striping
            if (index % 2 === 0) {
                doc.setFillColor(252, 252, 252);
                doc.rect(20, currentY - 6, 170, 10, 'F');
            }

            doc.text(item.name, 25, currentY);
            doc.text(item.quantity.toString(), 130, currentY, { align: 'center' });
            doc.text(`Rs. ${item.price}`, 155, currentY, { align: 'center' });
            doc.text(`Rs. ${item.quantity * item.price}`, 185, currentY, { align: 'right' });

            // Bottom line for each row
            doc.setDrawColor(240, 240, 240);
            doc.line(20, currentY + 4, 190, currentY + 4);
            currentY += 10;
        });

        // Total Section
        currentY += 10;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Subtotal:', 140, currentY);
        doc.text(`Rs. ${order.total}`, 185, currentY, { align: 'right' });

        currentY += 8;
        doc.text('Shipping:', 140, currentY);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text('FREE', 185, currentY, { align: 'right' });

        currentY += 10;
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.rect(135, currentY - 7, 55, 10, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text('TOTAL:', 140, currentY);
        doc.text(`Rs. ${order.total}`, 185, currentY, { align: 'right' });

        // Footer Section
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

    const handleDownloadInvoice = (order: any) => {
        const doc = generateInvoicePDF(order);
        doc.save(`Invoice_${order.id}.pdf`);
    };

    const handleViewInvoice = (order: any) => {
        navigate(`/invoice/${order.id}`);
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
            <Navbar />
            <main className="order-history-container">
                <header className="order-history-header">
                    <h1>My Order History</h1>
                    <p>Track and manage your recent purchases</p>
                </header>

                <div className="orders-list">
                    {ORDERS.map((order) => (
                        <div key={order.id} className="order-card">
                            <div className="order-card-header">
                                <div className="order-info">
                                    <span className="order-id">{order.id}</span>
                                    <span className="order-date">{order.date}</span>
                                </div>
                                <div className={`order-status status-${order.status.toLowerCase()}`}>
                                    {order.status}
                                </div>
                            </div>

                            <div className="order-items">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="order-item">
                                        <img src={item.image} alt={item.name} className="item-image" />
                                        <div className="item-details">
                                            <span className="item-name">{item.name}</span>
                                            <span className="item-qty">Qty: {item.quantity}</span>
                                        </div>
                                        <span className="item-price">₹{item.price}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="order-card-footer">
                                <div className="order-total">
                                    <span>Total Amount:</span>
                                    <strong>₹{order.total}</strong>
                                </div>
                                <div className="order-actions">
                                    <button className="btn-secondary" onClick={() => setSelectedOrder(order)}>View Details</button>
                                    <button className="btn-secondary" onClick={() => handleViewInvoice(order)}>View Invoice</button>
                                    <button className="btn-primary">Track Order</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Order Details Modal */}
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
                                    <strong>{selectedOrder.id}</strong>
                                </div>
                                <div className="detail-row">
                                    <span>Order Date:</span>
                                    <strong>{selectedOrder.date}</strong>
                                </div>
                                <div className="detail-row">
                                    <span>Status:</span>
                                    <span className={`status-badge status-${selectedOrder.status.toLowerCase()}`}>
                                        {selectedOrder.status}
                                    </span>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h3>Items Purchased</h3>
                                <div className="modal-items-list">
                                    {selectedOrder.items.map((item: any, idx: number) => (
                                        <div key={idx} className="modal-item">
                                            <img src={item.image} alt={item.name} />
                                            <div className="modal-item-info">
                                                <span className="modal-item-name">{item.name}</span>
                                                <span className="modal-item-qty">Qty: {item.quantity} x ₹{item.price}</span>
                                            </div>
                                            <span className="modal-item-total">₹{item.quantity * item.price}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="detail-section payment-info">
                                <h3>Payment Details</h3>
                                <div className="detail-row">
                                    <span>Subtotal:</span>
                                    <span>₹{selectedOrder.total}</span>
                                </div>
                                <div className="detail-row">
                                    <span>Shipping:</span>
                                    <span className="free-text">FREE</span>
                                </div>
                                <div className="detail-row total">
                                    <span>Total:</span>
                                    <strong>₹{selectedOrder.total}</strong>
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
