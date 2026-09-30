# Inventory Management System

A beginner-friendly MERN inventory management system for managing products, stock levels, and low-stock alerts.

## Features

- Add, view, edit, and delete products
- Stock in and stock out operations
- Backend protection against negative stock
- Dynamic `IN_STOCK`, `LOW_STOCK`, and `OUT_OF_STOCK` status
- Search by product name or SKU
- Filter by category and stock status
- Dashboard totals and low-stock list
- Loading, empty, and error states
- MongoDB Atlas persistence

## Technology

- Frontend: React and Vite
- Backend: Node.js and Express
- Database: MongoDB with Mongoose
- API: REST
- State management: React `useState` and `useEffect`
- Deployment: Render

## Project Structure

```text
inventory-management/
├── client/
│   └── src/
│       ├── components/
│       │   ├── ProductForm/
│       │   │   ├── ProductForm.jsx
│       │   │   └── ProductForm.css
│       │   └── ProductTable/
│       │       ├── ProductTable.jsx
│       │       └── ProductTable.css
│       ├── pages/
│       │   ├── Dashboard/
│       │   │   ├── Dashboard.jsx
│       │   │   └── Dashboard.css
│       │   └── Products/
│       │       ├── Products.jsx
│       │       └── Products.css
│       ├── services/productApi.js
│       ├── App.jsx
│       └── main.jsx
├── server/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/productController.js
│   │   ├── middleware/errorHandler.js
│   │   ├── models/Product.js
│   │   └── routes/productRoutes.js
│   └── server.js
├── render.yaml
└── package.json
```

The backend follows an MVC-style structure: models define data, controllers contain business logic, routes define endpoints, and middleware handles errors.

## Prerequisites

- Node.js and npm
- A MongoDB Atlas cluster
- A MongoDB Atlas database user

## Local Setup

From the project root, install all dependencies:

```text
npm.cmd run install:all
```

Create `server/.env` from `server/.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/inventory_management?retryWrites=true&w=majority
CLIENT_URL=http://localhost:5173
```

Do not commit `server/.env`. Make sure the MongoDB Atlas Network Access settings allow your local IP address.

## Run Locally

Start both applications:

```text
npm.cmd run dev
```

Local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Health check: `http://localhost:5000/api/health`

Build the frontend separately:

```text
npm.cmd run build
```

## Product Model

Products contain:

```text
name: String, required
sku: String, required and unique
category: String, required
price: Number, greater than or equal to 0
stock: Integer, greater than or equal to 0
lowStockThreshold: Integer, greater than or equal to 0
createdAt: Date
updatedAt: Date
```

Stock status is calculated dynamically and is not stored in MongoDB:

```text
stock === 0                 -> OUT_OF_STOCK
stock <= lowStockThreshold  -> LOW_STOCK
otherwise                   -> IN_STOCK
```

## API Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Check server availability |
| GET | `/api/products` | List products |
| GET | `/api/products/:id` | Get one product |
| POST | `/api/products` | Create a product |
| PUT | `/api/products/:id` | Update a product |
| DELETE | `/api/products/:id` | Delete a product |
| POST | `/api/products/:id/stock-in` | Increase stock |
| POST | `/api/products/:id/stock-out` | Decrease stock |

Stock request body:

```json
{
	"quantity": 10
}
```

Stock quantities must be positive integers. Stock out cannot exceed available stock.

The product list endpoint supports these query parameters:

```text
/api/products?search=keyboard&category=Electronics&status=LOW_STOCK
```

## Render Deployment

The root [render.yaml](render.yaml) defines the backend web service and frontend static site.

1. Push the repository to GitHub.
2. In Render, choose **New → Blueprint**.
3. Select the repository and the `main` branch.
4. Add `MONGODB_URI` when Render prompts for the secret.
5. Ensure MongoDB Atlas allows the Render service to connect.
6. Deploy both services.

Backend environment variables:

```text
MONGODB_URI=your MongoDB Atlas connection string
CLIENT_URL=https://inventory-management-system-frontend-0s7m.onrender.com
```

Frontend environment variable:

```text
VITE_API_URL=https://inventory-management-system-agqt.onrender.com
```

Current deployment URLs:

- Frontend: [inventory-management-system-frontend-0s7m.onrender.com](https://inventory-management-system-frontend-0s7m.onrender.com)
- Backend: [inventory-management-system-agqt.onrender.com](https://inventory-management-system-agqt.onrender.com)
- Backend health check: [api/health](https://inventory-management-system-agqt.onrender.com/api/health)

If Render assigns different URLs, update `CLIENT_URL` and `VITE_API_URL` in the Render service environment variables and redeploy.

## Troubleshooting

### Backend returns `x-render-routing: no-server`

The hostname is not connected to an active Render web service. Confirm the backend service uses `server` as its root directory and copy the actual External URL from Render.

### MongoDB connection fails

Check the `MONGODB_URI`, database-user credentials, Atlas Network Access rules, and that the cluster is running. Never share the URI or password publicly.

### Frontend cannot reach the API

Check that `VITE_API_URL` points to the live backend URL, `CLIENT_URL` points to the live frontend URL, and the frontend has been redeployed after changing environment variables.
