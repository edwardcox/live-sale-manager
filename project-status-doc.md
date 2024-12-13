# Live Sale Manager - Project Status Document

## Project Overview
A Shopify App for Scintera Pty Ltd (scintera.com.au) to manage product sales and discounts. The app enables individual and bulk management of product sales with automatic price calculations and configuration presets.

## Project Location & Access
```
Physical Path: /var/www/vhosts/geekdev.com.au/apps.geekdev.com.au/salemanager
Domain: apps.geekdev.com.au/salemanager
Store URL: scintera-pty-ltd.myshopify.com
Domain: scintera.com.au
```

## Project Status

### Completed Features
1. ✓ Stage 1: Basic Application Setup & Product Display
   - React + Vite configuration
   - TailwindCSS integration
   - Complete project structure
   - Product table implementation
   - Real-time search functionality
   - Responsive design
   - Error handling
   - Loading states

2. ✓ Stage 2: Metafields Integration
   - Complete metafields integration
   - Proper sale status detection
   - Sale price calculations
   - Sale image management
   - GraphQL query optimization
   - Data transformation refinement

3. ✓ Stage 3: Product Selection Implementation
   - Selection state management
   - Bulk actions interface
   - Multiple product updates
   - Select All/None functionality
   - Individual product selection

4. ✓ Stage 4: Sale Price Display
   - Automatic calculations 
   - Visual price updates
   - Sale status indicators
   - Sale badge overlays
   - Price formatting

5. ✓ Stage 5: Settings Management
   - Save/Restore functionality
   - Configuration presets
   - Import/Export capabilities
   - Confirmation dialogs
   - History tracking

## Directory Structure
```
salemanager/
├── src/
│   ├── components/
│   │   ├── products/
│   │   │   ├── ProductTable.jsx        # Main product listing
│   │   │   ├── ProductTableRow.jsx     # Individual product rows
│   │   │   ├── SaleSettingsDialog.jsx  # Sale configuration
│   │   │   ├── PresetSettingsDialog.jsx# Preset management
│   │   │   └── BulkActions.jsx         # Bulk operations
│   │   └── ui/
│   │       ├── button.jsx              # Reusable button component
│   │       ├── input.jsx               # Reusable input component
│   │       ├── table.jsx               # Reusable table component
│   │       └── ConfirmationDialog.jsx  # Reusable dialog component
│   ├── context/
│   │   └── SelectionContext.jsx        # Selection state management
│   ├── lib/
│   │   ├── shopify.js                  # Shopify API integration
│   │   └── utils.js                    # Utility functions
│   ├── hooks/
│   │   └── useProducts.js              # Product data management
│   ├── styles/
│   │   └── globals.css                 # Global styles
│   ├── main.jsx                        # Application entry
│   └── App.jsx                         # Root component
├── public/
│   └── assets/                         # Static assets
├── .env                                # Environment variables
├── index.html                          # HTML entry
├── package.json                        # Dependencies
├── vite.config.js                      # Vite configuration
├── postcss.config.js                   # PostCSS configuration
└── tailwind.config.js                  # Tailwind configuration
```

## Technical Details

### Key Features Implementation

1. Product Management
   - Real-time search functionality
   - Bulk selection capabilities
   - Individual product management
   - Sale status indicators
   - Sale price calculations

2. Sale Configuration
   - Individual product sale settings
   - Bulk sale operations
   - Percentage-based discounts
   - Sale image management
   - Price calculations

3. Preset Management
   - Save current configurations
   - Restore previous settings
   - Import/Export functionality
   - Configuration history
   - Confirmation dialogs

### Shopify Integration
```javascript
// Core GraphQL Query Structure
const query = `{
  products(first: 100) {
    edges {
      node {
        id
        title
        handle
        status
        images(first: 1) {
          edges {
            node {
              url
            }
          }
        }
        variants(first: 1) {
          edges {
            node {
              id
              price
              compareAtPrice
              inventoryQuantity
              inventoryPolicy
            }
          }
        }
        metafields(first: 20) {
          edges {
            node {
              namespace
              key
              value
              type
            }
          }
        }
      }
    }
  }
}`;
```

### Environment Variables Required
```env
VITE_SHOPIFY_STORE_URL=scintera-pty-ltd.myshopify.com
VITE_SHOPIFY_ACCESS_TOKEN=your_access_token_here
```

### Dependencies
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwindcss": "^3.3.6",
    "lucide-react": "^0.263.1",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.5"
  }
}
```

## Current Features

### Product Display
- Responsive product table
- Real-time search functionality
- Sale status indicators
- Price formatting
- Image display with sale badges
- Action buttons for each product

### Sale Management
- Individual product sale settings
- Bulk sale operations
- Percentage-based discounts
- Sale image management
- Price calculations

### Preset System
- Save configurations
- Restore previous settings
- Import/Export functionality
- Configuration history
- Confirmation dialogs

## Setup Instructions

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Required Configuration
1. Environment Variables
   - Shopify store URL
   - Access token
   - API credentials

2. Development Tools
   - Node.js v16+
   - npm or yarn
   - Modern web browser

## Support Contact
For technical support or questions:
- Developer: [Contact Information]
- Project Manager: [Contact Information]
- Store Admin: [Contact Information]

## Next Steps
1. Performance Optimization
   - Add pagination for large product lists
   - Implement caching
   - Optimize bulk operations

2. Feature Enhancements
   - Add advanced filtering options
   - Implement sorting functionality
   - Add batch operation history

3. UI Improvements
   - Add more detailed success notifications
   - Enhance error messages
   - Add tooltips for complex features

