# 3D Miniature Ordering Platform - Setup Instructions

## 📋 Project Overview

This is a complete full-stack e-commerce platform for ordering custom 3D miniatures built with:
- **Frontend**: Next.js 14 + React 18
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Styling**: Tailwind CSS + shadcn/ui
- **Authentication**: JWT

## 🗂️ Project Structure

```
3d-miniature-platform/
├── app/
│   ├── api/[[...path]]/route.js  # Backend API endpoints
│   ├── page.js                    # Main frontend application
│   ├── layout.js                  # App layout wrapper
│   └── globals.css                # Global styles
├── components/ui/                 # shadcn/ui components (60+ components)
│   ├── button.jsx
│   ├── card.jsx
│   ├── input.jsx
│   ├── badge.jsx
│   ├── tabs.jsx
│   ├── select.jsx
│   ├── textarea.jsx
│   └── ... (and many more)
├── lib/
│   └── utils.js                   # Utility functions
├── hooks/                         # Custom React hooks
├── public/                        # Static files
│   └── uploads/                   # File uploads directory
├── scripts/
│   └── seed.js                    # Database seeding script
├── package.json                   # Dependencies
├── .env                          # Environment variables
├── tailwind.config.js            # Tailwind configuration
├── postcss.config.js             # PostCSS configuration
├── next.config.js                # Next.js configuration
└── README.md                     # Project documentation
```

## 🚀 Installation Steps

### Prerequisites
- **Node.js**: v18.x or higher
- **npm** or **yarn**: Latest version
- **MongoDB**: v6.x or higher (running locally or remote)

### Step 1: Extract the ZIP file
```bash
unzip 3d-miniature-platform.zip
cd 3d-miniature-platform
```

### Step 2: Install Dependencies
Using yarn (recommended):
```bash
yarn install
```

Or using npm:
```bash
npm install
```

This will install all required packages including:
- next (^14.2.0)
- react (^18.3.0)
- mongodb (^6.3.0)
- bcryptjs (^2.4.3)
- jsonwebtoken (^9.0.2)
- uuid (^9.0.1)
- tailwindcss (^3.4.0)
- lucide-react (latest)
- @radix-ui components (latest)

### Step 3: Set Up MongoDB

**Option A: Local MongoDB**
1. Install MongoDB from https://www.mongodb.com/try/download/community
2. Start MongoDB service:
   ```bash
   # On macOS
   brew services start mongodb-community

   # On Linux
   sudo systemctl start mongodb

   # On Windows
   net start MongoDB
   ```

**Option B: MongoDB Atlas (Cloud)**
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get your connection string
4. Update the `.env` file with your connection string

### Step 4: Configure Environment Variables

The `.env` file is already included. Update if needed:
```env
# MongoDB Connection
MONGO_URL=mongodb://localhost:27017

# Application URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# JWT Secret (change this in production!)
JWT_SECRET=your-secret-key-change-in-production
```

**Important**: Change the `JWT_SECRET` to a secure random string in production!

### Step 5: Create Uploads Directory
```bash
mkdir -p public/uploads
chmod 755 public/uploads
```

### Step 6: Seed the Database
Populate the database with sample products, users, and coupons:
```bash
node scripts/seed.js
```

This creates:
- ✅ Admin user: admin@miniatures.com / admin123
- ✅ Customer user: customer@example.com / customer123
- ✅ 8 sample products with images
- ✅ 3 coupon codes: WELCOME10, SUMMER25, FIRST20

### Step 7: Start the Development Server
```bash
# Using yarn
yarn dev

# Using npm
npm run dev
```

The application will be available at: **http://localhost:3000**

### Step 8: Build for Production (Optional)
```bash
# Build the application
yarn build

# Start production server
yarn start
```

## 🔐 Demo Accounts

### Admin Access
- **Email**: admin@miniatures.com
- **Password**: admin123
- **Access**: Full admin dashboard, product management, order management, coupon management, review approval

### Customer Access
- **Email**: customer@example.com
- **Password**: customer123
- **Access**: Shopping, cart, checkout, orders, profile, custom orders

## 🎫 Demo Coupon Codes

Test the coupon system with these codes:
- **WELCOME10**: 10% discount
- **SUMMER25**: 25% discount
- **FIRST20**: $20 fixed discount

## 📱 Features to Test

### Public Pages
1. Navigate to home page - view hero banner and featured products
2. Click "About" - read about the platform
3. Click "Shop" - browse all products without login

### Customer Flow
1. Click "Sign Up" - create a new account
2. Browse products and click any product for details
3. Click "Add to Cart" on products
4. Go to Cart - update quantities, apply coupon codes
5. Click "Proceed to Checkout"
6. Add a shipping address in Profile > Addresses
7. Complete checkout (mock payment)
8. View orders in "Orders" section
9. Create custom order in Profile > Custom Order (upload images)
10. Submit a product review (requires admin approval)

### Admin Flow
1. Login as admin
2. View dashboard with analytics
3. Go to "Products" tab - add/edit/delete products
4. Go to "Orders" tab - view and update order status
5. Go to "Coupons" tab - create new discount codes
6. Go to "Reviews" tab - approve customer reviews

## 🗄️ Database Collections

The MongoDB database (`miniature_platform`) contains these collections:

1. **users** - User accounts with authentication
2. **products** - Product catalog with images and pricing
3. **orders** - Customer orders and custom miniature orders
4. **cart** - Shopping cart items
5. **addresses** - Customer shipping addresses
6. **coupons** - Discount coupon codes
7. **reviews** - Product reviews (pending and approved)
8. **analytics** - Visitor and usage tracking

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password recovery
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Add product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders
- `GET /api/orders` - Get orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Place order
- `POST /api/orders/custom` - Create custom order
- `PUT /api/orders/:id` - Update order status (admin only)

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart/add` - Add to cart
- `PUT /api/cart/update` - Update quantity
- `DELETE /api/cart/remove` - Remove from cart

### Coupons
- `POST /api/coupons/validate` - Validate coupon
- `GET /api/coupons` - Get all coupons (admin only)
- `POST /api/coupons` - Create coupon (admin only)
- `DELETE /api/coupons/:id` - Delete coupon (admin only)

### Reviews
- `GET /api/reviews/:productId` - Get approved reviews
- `POST /api/reviews` - Submit review
- `PUT /api/reviews/:id/approve` - Approve review (admin only)
- `GET /api/admin/reviews/pending` - Get pending reviews (admin only)

### File Upload
- `POST /api/upload` - Upload files (images)

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js` to customize the color scheme:
```javascript
theme: {
  extend: {
    colors: {
      primary: {...},  // Change primary colors
      secondary: {...}, // Change secondary colors
    }
  }
}
```

### Add New Products
Use the admin panel or directly insert into MongoDB:
```javascript
{
  id: "unique-id",
  name: "Product Name",
  description: "Product description",
  price: 99.99,
  category: "Category Name",
  image: "https://image-url.com/image.jpg",
  createdAt: new Date()
}
```

### Modify UI Components
All UI components are in `components/ui/` and can be customized.

## 🔧 Troubleshooting

### Issue: MongoDB Connection Error
**Solution**: 
- Ensure MongoDB is running: `mongod --version`
- Check the connection string in `.env`
- For MongoDB Atlas, whitelist your IP address

### Issue: Port 3000 Already in Use
**Solution**:
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 yarn dev
```

### Issue: Module Not Found Errors
**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json yarn.lock
yarn install
```

### Issue: Images Not Loading
**Solution**:
- Check `public/uploads/` directory exists and has write permissions
- Ensure image URLs in products are valid and accessible

### Issue: Tailwind Styles Not Applied
**Solution**:
```bash
# Rebuild the application
rm -rf .next
yarn dev
```

## 📦 Production Deployment

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Add environment variables:
   - `MONGO_URL`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_BASE_URL`
5. Deploy!

### Deploy to Other Platforms
- **Netlify**: Use `@netlify/plugin-nextjs`
- **Heroku**: Add `Procfile` with `web: yarn start`
- **AWS**: Use AWS Amplify or EC2
- **DigitalOcean**: Use App Platform

### Environment Variables for Production
```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/miniature_platform
JWT_SECRET=your-super-secret-production-key-change-this
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
NODE_ENV=production
```

## 🔒 Security Best Practices

1. **Change JWT_SECRET**: Use a strong, random secret key
2. **Use HTTPS**: Always use SSL certificates in production
3. **Environment Variables**: Never commit `.env` to version control
4. **Input Validation**: Already implemented in the API
5. **Rate Limiting**: Consider adding rate limiting for API endpoints
6. **CORS**: Configure CORS based on your domain
7. **MongoDB**: Use strong passwords and connection strings

## 📚 Additional Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **MongoDB Documentation**: https://docs.mongodb.com
- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com
- **React Documentation**: https://react.dev

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the README.md file
3. Check the code comments in `app/api/[[...path]]/route.js`
4. Refer to the official documentation of each technology

## 📝 Notes

- **File Uploads**: Currently stored locally in `public/uploads/`. For production, consider using cloud storage (AWS S3, Cloudinary, etc.)
- **Email**: Email functionality is mocked. Integrate SendGrid or similar for production.
- **Payment**: Payment button is mocked. Integrate Stripe or Razorpay for real payments.
- **Analytics**: Basic analytics implemented. Consider Google Analytics or similar for detailed tracking.

## ✅ Quick Start Checklist

- [ ] Extract ZIP file
- [ ] Run `yarn install`
- [ ] Start MongoDB
- [ ] Configure `.env` file
- [ ] Create uploads directory
- [ ] Run `node scripts/seed.js`
- [ ] Run `yarn dev`
- [ ] Open http://localhost:3000
- [ ] Login as admin (admin@miniatures.com / admin123)
- [ ] Test customer flow (customer@example.com / customer123)

---

**Built with ❤️ using Next.js, React, MongoDB, and Tailwind CSS**

Happy coding! 🚀
