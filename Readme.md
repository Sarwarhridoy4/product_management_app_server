# Product Management Server

This is a Node.js + Express + TypeScript backend for managing **Users, Categories, and Products** with JWT-based authentication and full CRUD functionality.

---

## Features

- JWT Authentication (Access & Refresh Tokens)
- User Signup & Login
- Categories CRUD with search & pagination
- Products CRUD with category filter, search, pagination, and slug lookup
- Role-based access control
- Error handling with proper HTTP status codes

---

## Tech Stack

- Node.js
- Express
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- HTTP Status Codes (`http-status-codes`)

---

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/ecommerce-api.git
cd ecommerce-api
```

2. **Install dependencies**

```bash
npm install
```

3. **Create `.env` file**

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
```

4. **Run the server**

```bash
# development with hot reload
npm run dev

# build and run
npm run build
npm start
```

The server will start on `http://localhost:5000`.

---

## Authentication

All endpoints are **protected**. Include a valid JWT token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

All requests must be `Content-Type: application/json`. Multipart/form-data is **not supported**.

---

## API Documentation

### Users

#### Signup

```
POST /api/auth/signup
```

**Body**

```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Response**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "64f123abc...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Login

```
POST /api/auth/login
```

**Body**

```json
{
  "email": "john@example.com"
}
```

**Response**

```json
{
  "message": "Login successful",
  "user": {
    "id": "64f123abc...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "tokens": {
    "accessToken": "<access_token>",
    "refreshToken": "<refresh_token>"
  }
}
```

---

### Categories

#### List Categories

```
GET /api/categories
```

**Query Parameters (Optional)**

- `page` – page number (default 1)
- `limit` – items per page (default 10)
- `searchedText` – search by category name
- `sort` – field to sort (default `-createdAt`)

**Response**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "id": "9c1129eb-cb7f-4c34-a94e-193a40f37a87",
      "name": "Clothes",
      "description": null,
      "image": "https://i.imgur.com/QkIa5tT.jpeg",
      "createdAt": "2025-09-30T11:07:09.824206+00:00"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPage": 5
  }
}
```

#### Create Category

```
POST /api/categories
```

**Body**

```json
{
  "name": "Shoes",
  "description": "All types of shoes",
  "image": "https://i.imgur.com/example.jpeg"
}
```

---

#### Update Category

```
PUT /api/categories/:id
```

**Body**

```json
{
  "name": "Shoes Updated"
}
```

---

#### Delete Category

```
DELETE /api/categories/:id
```

---

### Products

#### List Products

```
GET /api/products
```

**Query Parameters**

- `page` – page number
- `limit` – items per page
- `offset` – alternative pagination
- `searchedText` – search by product name
- `categoryId` – filter by category ID
- `sort` – sort field

#### Get Product by Slug

```
GET /api/products/:slug
```

#### Create Product

```
POST /api/products
```

**Body**

```json
{
  "name": "New Product",
  "description": "Product description",
  "images": ["https://laravelpoint.com/files/p_img.jpg"],
  "price": 1000,
  "categoryId": "9c1129eb-cb7f-4c34-a94e-193a40f37a87"
}
```

#### Update Product

```
PUT /api/products/:id
```

**Body**

```json
{
  "name": "Updated Product Name",
  "price": 1200
}
```

#### Delete Product

```
DELETE /api/products/:id
```

---

### Pagination

- **page & limit**: `?page=2&limit=10`
- **offset & limit**: `?offset=20&limit=10`

### Search

- **Categories**: `?searchedText=cloth`
- **Products**: `?searchedText=test+pro`

---

## Error Handling

All errors return a JSON object:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message"
}
```

---

This README covers **setup, authentication, all APIs, pagination, search, and error handling**.
