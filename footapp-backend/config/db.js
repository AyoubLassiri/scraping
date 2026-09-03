const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const {
    DB_HOST = 'localhost',
    DB_USER = 'root',
    DB_PASSWORD = '',
    DB_NAME = 'footapp_db'
} = process.env;

let pool;

async function initDB() {
    try {
        // 1. Initial connection without database to ensure DB exists
        const connection = await mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD
        });

        // 2. Automatically create database if it does not exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
        await connection.end();

        // 3. Create the persistent connection pool connected to the database
        pool = mysql.createPool({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        // 4. Create products table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS products (
                id VARCHAR(50) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                description TEXT,
                images JSON,
                sizes JSON,
                inStock BOOLEAN DEFAULT TRUE,
                promoType ENUM('none', 'percentage', 'fixed') DEFAULT 'none',
                promoValue DECIMAL(10,2) DEFAULT 0.00,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Migration check: Ensure promo columns exist if the table was created previously without them
        const [columns] = await pool.query(`SHOW COLUMNS FROM products LIKE 'promoType'`);
        if (columns.length === 0) {
            await pool.query(`
                ALTER TABLE products 
                ADD COLUMN promoType ENUM('none', 'percentage', 'fixed') DEFAULT 'none',
                ADD COLUMN promoValue DECIMAL(10,2) DEFAULT 0.00;
            `);
            console.log("Added promoType and promoValue columns to products table.");
        }

        // 5. Create orders table for the checkout system
        await pool.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                phone VARCHAR(50) NOT NULL,
                address TEXT NOT NULL,
                city VARCHAR(100) NOT NULL,
                total_price DECIMAL(10, 2) NOT NULL,
                items JSON NOT NULL,
                status VARCHAR(50) DEFAULT 'Pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // 6. Create admins table for secure admin panel login
        await pool.query(`
            CREATE TABLE IF NOT EXISTS admins (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // 7. Create staff table for team staff members with image support
        await pool.query(`
            CREATE TABLE IF NOT EXISTS staff (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                role VARCHAR(100) NOT NULL,
                description TEXT,
                image VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Migration check: Ensure image column exists if staff table already existed without it
        const [staffColumns] = await pool.query(`SHOW COLUMNS FROM staff LIKE 'image'`);
        if (staffColumns.length === 0) {
            await pool.query(`ALTER TABLE staff ADD COLUMN image VARCHAR(255);`);
            console.log("Added image column to staff table.");
        }

        // 8. Create players table for team squad members with image support
        await pool.query(`
            CREATE TABLE IF NOT EXISTS players (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                position VARCHAR(100) NOT NULL,
                number INT,
                description TEXT,
                image VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Migration check: Ensure columns exist if players table already existed
        const [playerColumns] = await pool.query(`SHOW COLUMNS FROM players LIKE 'position'`);
        if (playerColumns.length === 0) {
            await pool.query(`ALTER TABLE players ADD COLUMN position VARCHAR(100) NOT NULL;`);
            console.log("Added position column to players table.");
        }

        // 9. Check if products table is empty, then seed initial data
        const [rows] = await pool.query('SELECT COUNT(*) as count FROM products');
        if (rows[0].count === 0) {
            const initialProducts = [
                [
                    'cmm-home-jersey-26',
                    'القميص الرسمي الأساسي لمستقبل المرسى 2026',
                    150.00,
                    'القميص الرسمي للموسم الجديد. يتميز بنسيج رياضي عالي الجودة ومضاد للتعرق، مع تصميم يبرز هوية النادي وألوانه التاريخية.',
                    JSON.stringify(['https://howatpress.net/wp-content/uploads/2024/03/cmm.jpg']),
                    JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
                    true,
                    'none',
                    0.00
                ],
                [
                    'cmm-training-shirt-26',
                    'قميص التداريب الرسمي',
                    120.00,
                    'قميص التداريب خفيف الوزن مصمم لتوفير أقصى درجات الراحة أثناء الأداء الرياضي.',
                    JSON.stringify(['https://howatpress.net/wp-content/uploads/2024/03/cmm.jpg']),
                    JSON.stringify(['M', 'L', 'XL']),
                    true,
                    'none',
                    0.00
                ],
                [
                    'cmm-scarf-26',
                    'وشاح النادي (شال)',
                    80.00,
                    'وشاح شتوي دافئ يحمل ألوان وشعار نادي مستقبل المرسى. مثالي لدعم الفريق في المباريات الباردة.',
                    JSON.stringify(['https://howatpress.net/wp-content/uploads/2024/03/cmm.jpg']),
                    JSON.stringify(['مقاس موحد']),
                    false,
                    'none',
                    0.00
                ]
            ];

            await pool.query(
                `INSERT INTO products (id, name, price, description, images, sizes, inStock, promoType, promoValue) VALUES ?`,
                [initialProducts]
            );
        }

        // 10. Check if admins table is empty, then create default admin
        const [adminRows] = await pool.query('SELECT COUNT(*) as count FROM admins');
        if (adminRows[0].count === 0) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await pool.query('INSERT INTO admins (username, password) VALUES (?, ?)', ['admin', hashedPassword]);
            console.log('Default admin created. Username: admin | Password: admin123');
        }

        console.log(`Connected to MySQL and '${DB_NAME}' database initialized successfully.`);
    } catch (error) {
        console.error('Database initialization failed:', error.message);
    }
}

initDB();

module.exports = {
    query: (...args) => pool.query(...args)
};