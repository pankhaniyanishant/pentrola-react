import Navbar from './Navbar';
import Hero from './Hero';
import CategoryGrid from './CategoryGrid';
import Bestsellers from './Bestsellers';
import Advantage from './Advantage';
import PromoBanner from './PromoBanner';
import NewArrivals from './NewArrivals';
import ShopByPrice from './ShopByPrice';
import Testimonials from './Testimonials';
import Newsletter from './Newsletter';
import Footer from './Footer';

const Home = () => {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
            <Navbar />
            <main>
                <Hero />
                <CategoryGrid />
                <Bestsellers />
                <Advantage />
                <PromoBanner />
                <NewArrivals />
                <ShopByPrice />
                <Testimonials />
                <Newsletter />
            </main>
            <Footer />
        </div>
    );
};

export default Home;
