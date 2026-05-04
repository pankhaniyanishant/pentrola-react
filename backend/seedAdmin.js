const User = require('./models/User');

const ensureDefaultAdmin = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            return;
        }

        await User.create({
            name: process.env.ADMIN_NAME || 'Admin',
            email: adminEmail,
            password: process.env.ADMIN_PASSWORD || 'admin123',
            isAdmin: true,
        });

        console.log(`Default admin created with email: ${adminEmail}`);
    } catch (error) {
        console.error(`Failed to seed default admin: ${error.message}`);
    }
};

module.exports = ensureDefaultAdmin;
