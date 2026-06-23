Here's the clean text version:

---

# DIGISTORE — API Documentation
*Stack: React · Express · Prisma · PostgreSQL*

---

## Models Overview

| Model | Description |
|---|---|
| User | Customers and admins |
| Address | Shipping addresses per user |
| Category | Product categories |
| Product | Store products with stock and images |
| Cart | One cart per user |
| CartItem | Items inside a cart |
| Order | Placed orders after checkout |
| OrderItem | Snapshot of items at time of order |

### Delete Behavior

| Relation | On Delete |
|---|---|
| User → Cart | Cascade |
| User → Address | Cascade |
| User → Order | Restrict |
| Cart → CartItem | Cascade |
| Product → CartItem | Restrict |
| Product → OrderItem | Restrict |
| Category → Product | Restrict |
| Order → OrderItem | Cascade |
| Address → Order | Restrict |

---

## Auth

Handles user registration, login, and logout. Tokens are used for subsequent authenticated requests.

| Method | Endpoint | Description |
|---|---|---|
| POST | /auth/register | Register a new user |
| POST | /auth/login | Login and receive token |
| POST | /auth/logout | Logout current user |

---

## Users

| Method | Endpoint | Access |
|---|---|---|
| GET | /users | Admin only |
| GET | /users/:id | Admin or own |
| PATCH | /users/:id | Own only |
| DELETE | /users/:id | Admin or own |

---

## Addresses

| Method | Endpoint | Description |
|---|---|---|
| GET | /addresses | Get own addresses |
| POST | /addresses | Create new address |
| PATCH | /addresses/:id | Update address |
| PATCH | /addresses/:id/default | Set as default |
| DELETE | /addresses/:id | Delete address |

> Note: Setting a default address uses a transaction — all other addresses are unset first, then the selected one is marked as default.

---

## Categories

| Method | Endpoint | Access |
|---|---|---|
| GET | /categories | Public |
| POST | /categories | Admin only |
| PATCH | /categories/:id | Admin only |
| DELETE | /categories/:id | Admin only — restricted if category has products |

---

## Products

| Method | Endpoint | Access |
|---|---|---|
| GET | /products | Public — supports filtering & pagination |
| GET | /products/:id | Public |
| POST | /products | Admin only |
| PATCH | /products/:id | Admin only |
| DELETE | /products/:id | Admin only — restricted if in cart or orders |

### Query Parameters

| Parameter | Type | Description |
|---|---|---|
| categoryId | string | Filter by category |
| minPrice | number | Minimum price |
| maxPrice | number | Maximum price |
| search | string | Search by product name (case-insensitive) |
| page | number | Page number |
| limit | number | Items per page |

---

## Cart

| Method | Endpoint | Description |
|---|---|---|
| GET | /cart | Get own cart with all items |
| POST | /cart/items | Add item to cart |
| PATCH | /cart/items/:itemId | Update item quantity |
| DELETE | /cart/items/:itemId | Remove a single item |
| DELETE | /cart | Clear entire cart |

> Note: Adding an existing product to the cart will increment its quantity rather than create a duplicate entry.

---

## Orders

| Method | Endpoint | Access |
|---|---|---|
| GET | /orders | Own orders (customer) · All orders (admin) |
| GET | /orders/:id | Own order detail |
| POST | /orders | Checkout — creates order from cart |
| PATCH | /orders/:id/status | Admin only |
| DELETE | /orders/:id | Admin only |

### Order Status Flow

PENDING → PROCESSING → SHIPPED → DELIVERED
                            ↓
                        CANCELLED

### Checkout Steps

| Step | Action |
|---|---|
| 1 | Fetch cart and all items |
| 2 | Validate stock for each item |
| 3 | Calculate total |
| 4 | Create order with price snapshot per item |
| 5 | Decrement stock for each product |
| 6 | Clear the cart |

> Note: Prices are snapshotted at the time of order. If a product price changes later, existing order items are unaffected.

---

## Access Control Summary

| Resource | Public | Customer | Admin |
|---|---|---|---|
| Auth | POST register & login | — | — |
| Categories | GET | — | POST, PATCH, DELETE |
| Products | GET | — | POST, PATCH, DELETE |
| Users | — | GET own, PATCH own | GET all, DELETE |
| Addresses | — | Full CRUD (own only) | — |
| Cart | — | Full CRUD (own only) | — |
| Orders | — | GET own, POST (checkout) | GET all, PATCH status, DELETE |