# INOX Store - E-commerce Platform

A comprehensive e-commerce platform built with Next.js 14, featuring category-wise product carousels, user authentication, shopping cart, wishlist, and complete checkout process.

## Features

### 🛍️ Shopping Experience
- **Homepage with Category Carousels**: Electronics, Appliances, IT Products
- **Product Listing & Filtering**: Filter by category, brand, price range
- **Product Detail Pages**: Image gallery, specifications, reviews, related products
- **Search Functionality**: Full-text search across products
- **Quick View**: Product popup with detailed information

### 🛒 Cart & Wishlist
- **Shopping Cart**: Add/remove items, quantity management, persistent storage
- **Wishlist**: Save items for later, real-time updates
- **Context API**: Real-time cart and wishlist updates across the app

### 👤 User Management
- **Authentication**: Login/Register with NextAuth.js
- **User Account Dashboard**: 
  - Overview with personal information
  - Order history with tracking
  - Address management
  - Payment methods
  - Wishlist management
  - Account settings

### 💳 Checkout & Orders
- **Guest Checkout**: Shop without registration
- **Complete Checkout Process**: Address, payment method selection
- **Cash on Delivery**: Primary payment method
- **Order Confirmation**: Email notifications with order details
- **Coupon System**: Discount codes with validation

### 📧 Email Integration
- **Mailtrap Integration**: Development email testing
- **Order Confirmations**: Branded email templates
- **New User Welcome**: Account credentials for guest orders

### 🎨 Design & UX
- **Responsive Design**: Mobile-first approach
- **Brand Colors**: Custom theme with #0042adef
- **Modern UI**: shadcn/ui components
- **Loading States**: Proper loading indicators
- **Error Handling**: User-friendly error messages

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Email**: Nodemailer with Mailtrap
- **State Management**: React Context API

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)
- Mailtrap account (for email testing)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd inox-ecommerce
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Setup**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Update the environment variables:
   \`\`\`env
   MONGODB_URI=mongodb://localhost:27017/inox-store
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   MAILTRAP_HOST=sandbox.smtp.mailtrap.io
   MAILTRAP_PORT=2525
   MAILTRAP_USER=your-mailtrap-username
   MAILTRAP_PASS=your-mailtrap-password
   \`\`\`

4. **Seed the Database**
   \`\`\`bash
   node scripts/seed-database.js
   node scripts/seed-coupons.js
   \`\`\`

5. **Run the Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### For Customers
1. **Browse Products**: Visit homepage to see category carousels
2. **Search & Filter**: Use search bar or apply filters on products page
3. **Add to Cart**: Click + button on product cards or use product detail page
4. **Manage Wishlist**: Heart icon to save/remove items
5. **Checkout**: Complete purchase with address and payment details
6. **Account Management**: Register/login to track orders and manage profile

### Test Coupons
- `SAVE10`: 10% off on orders above ₹1000
- `FLAT500`: ₹500 off on orders above ₹5000  
- `WELCOME20`: 20% off for new customers (min ₹2000)

### Sample Products
The database includes sample products across three categories:
- **Electronics**: TVs, ACs, Headphones, Security Cameras
- **Appliances**: Washing Machines, Refrigerators, Microwaves
- **IT Products**: Laptops, Computers

## API Endpoints

### Products
- `GET /api/products` - Get products with filtering
- `GET /api/categories` - Get all categories
- `GET /api/brands` - Get all brands

### Orders
- `POST /api/orders` - Create new order
- `GET /api/users/[id]/orders` - Get user orders

### User Management
- `POST /api/auth/register` - Register new user
- `GET /api/users/[id]/stats` - Get user statistics
- `GET /api/users/[id]/addresses` - Get user addresses

### Coupons
- `POST /api/coupons/apply` - Apply coupon code

## Project Structure

\`\`\`
├── app/                    # Next.js 14 app directory
│   ├── api/               # API routes
│   ├── account/           # User account pages
│   ├── checkout/          # Checkout process
│   ├── products/          # Product pages
│   └── order-confirmation/ # Order success page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── Header.tsx        # Main navigation
│   ├── ProductCard.tsx   # Product display
│   ├── CartSidebar.tsx   # Shopping cart
│   └── Account*.tsx      # Account management
├── contexts/             # React Context providers
├── lib/                  # Utility functions
├── models/              # Mongoose schemas
└── scripts/             # Database seeding scripts
\`\`\`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
