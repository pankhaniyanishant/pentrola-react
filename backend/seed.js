const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const initialProducts = [
    { title: 'sequence', category: 'INTERIOR TOY', price: 1299, description: 'Sequence Game', originalPrice: '₹1,500', rating: 4.8, reviews: 234, discount: '19% OFF', image: '/hero-sequence.png', stock: 15 },
    { title: 'flip & match', category: 'INTERIOR TOY', price: 1499, description: 'Flip and match', originalPrice: '₹1,800', rating: 4.7, reviews: 189, discount: '21% OFF', image: '/hero-xylophone.png', stock: 5 },
    { title: 'kids gun', category: 'INTERIOR TOY', price: 1399, description: 'Kids Gun', originalPrice: '₹1,700', rating: 4.9, reviews: 312, discount: '22% OFF', image: '/kids-playing.png', stock: 0 },
    { title: 'Artist Brush Set', category: 'BRUSHES & TOOLS', price: 899, description: 'Brush Set', originalPrice: '₹1,100', rating: 4.5, reviews: 156, discount: '25% OFF', image: '/smart-sequence.png', stock: 25 },
    { title: 'premium can', category: 'SPRAY PAINT', price: 499, description: 'Premium Can', originalPrice: '₹600', rating: 4.2, reviews: 80, discount: '16% OFF', image: '/cat-toys.png', stock: 12 },
    { title: 'colorful blocks', category: 'Top Rated', price: 799, description: 'Blocks', originalPrice: '₹999', rating: 4.6, reviews: 120, discount: '20% OFF', image: '/educational-toys.png', topRated: true, stock: 40 },
    { title: 'train set bucket', category: 'INTERIOR TOY', price: 1199, description: 'Train Set', originalPrice: '₹1,500', rating: 4.4, reviews: 95, discount: '20% OFF', image: '/cat-toys.png', stock: 8 },
    { title: 'marble run game', category: 'INTERIOR TOY', price: 999, description: 'Marble Run', originalPrice: '₹1,200', rating: 4.8, reviews: 210, discount: '16% OFF', image: '/smart-sequence.png', stock: 10 }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pentrola');
        await Product.deleteMany({});
        await Product.insertMany(initialProducts);
        console.log('Seed Success');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

seedDB();
