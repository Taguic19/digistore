# E-Commerce API Documentation

> Stack: Vue + Express + Prisma + PostgreSQL

---

## Table of Contents

1. [Prisma Schema](#prisma-schema)
2. [Models Overview](#models-overview)
3. [Auth](#auth)
4. [Users](#users)
5. [Addresses](#addresses)
6. [Categories](#categories)
7. [Products](#products)
8. [Cart](#cart)
9. [Orders](#orders)
10. [Access Control Summary](#access-control-summary)

---

## Models Overview

| Model | Description |
|---|---|
| `User` | Customers and admins |
| `Address` | Shipping addresses per user |
| `Category` | Product categories |
| `Product` | Store products with stock and images |
| `Cart` | One cart per user |
| `CartItem` | Items inside a cart |
| `Order` | Placed orders after checkout |
| `OrderItem` | Snapshot of items at time of order |

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

### Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and receive token |
| POST | `/auth/logout` | Logout current user |

### Operations

```ts
// Register
prisma.user.create({
  data: { email, password: hashedPassword, name }
})

// Login — fetch user then compare password
prisma.user.findUnique({ where: { email } })

// Get current user — never return password
prisma.user.findUnique({
  where: { id: userId },
  select: { id: true, email: true, name: true, role: true }
})
```

---

## Users

### Endpoints

| Method | Endpoint | Access |
|---|---|---|
| GET | `/users` | Admin only |
| GET | `/users/:id` | Admin or own |
| PATCH | `/users/:id` | Own only |
| DELETE | `/users/:id` | Admin or own |

### Operations

```ts
// Get all users (admin)
prisma.user.findMany({
  select: { id: true, email: true, name: true, role: true, createdAt: true }
})

// Update user
prisma.user.update({
  where: { id: userId },
  data: { name }
})

// Delete user — cascades to cart and addresses
prisma.user.delete({ where: { id: userId } })
```

---

## Addresses

### Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/addresses` | Get own addresses |
| POST | `/addresses` | Create new address |
| PATCH | `/addresses/:id` | Update address |
| PATCH | `/addresses/:id/default` | Set as default |
| DELETE | `/addresses/:id` | Delete address |

### Operations

```ts
// Get all addresses of user
prisma.address.findMany({ where: { userId } })

// Create address
prisma.address.create({
  data: { userId, fullName, phone, street, city, province, postalCode }
})

// Set as default — unset others first
await prisma.$transaction([
  prisma.address.updateMany({
    where: { userId },
    data: { isDefault: false }
  }),
  prisma.address.update({
    where: { id: addressId },
    data: { isDefault: true }
  })
])

// Delete — restricted if tied to an order
prisma.address.delete({ where: { id: addressId } })
```

---

## Categories

### Endpoints

| Method | Endpoint | Access |
|---|---|---|
| GET | `/categories` | Public |
| POST | `/categories` | Admin only |
| PATCH | `/categories/:id` | Admin only |
| DELETE | `/categories/:id` | Admin only |

### Operations

```ts
// Get all with product count
prisma.category.findMany({
  include: { _count: { select: { products: true } } }
})

// Create
prisma.category.create({ data: { name } })

// Delete — restricted if has products
prisma.category.delete({ where: { id: categoryId } })
```

---

## Products

### Endpoints

| Method | Endpoint | Access |
|---|---|---|
| GET | `/products` | Public |
| GET | `/products/:id` | Public |
| POST | `/products` | Admin only |
| PATCH | `/products/:id` | Admin only |
| DELETE | `/products/:id` | Admin only |

### Query Parameters (GET /products)

| Param | Type | Description |
|---|---|---|
| `categoryId` | string | Filter by category |
| `minPrice` | number | Minimum price |
| `maxPrice` | number | Maximum price |
| `search` | string | Search by name |
| `page` | number | Page number |
| `limit` | number | Items per page |

### Operations

```ts
// Get all with filters and pagination
prisma.product.findMany({
  where: {
    categoryId: categoryId ?? undefined,
    price: {
      gte: minPrice ?? undefined,
      lte: maxPrice ?? undefined
    },
    stock: { gt: 0 },
    name: { contains: search, mode: "insensitive" }
  },
  include: { category: true },
  orderBy: { createdAt: "desc" },
  skip: (page - 1) * limit,
  take: limit
})

// Get single product
prisma.product.findUnique({
  where: { id: productId },
  include: { category: true }
})

// Create
prisma.product.create({
  data: { name, description, price, stock, images, categoryId }
})

// Update stock
prisma.product.update({
  where: { id: productId },
  data: { stock: { decrement: quantity } } // or increment
})

// Delete — restricted if in cart or orders
prisma.product.delete({ where: { id: productId } })
```

---

## Cart

### Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/cart` | Get own cart with items |
| POST | `/cart/items` | Add item to cart |
| PATCH | `/cart/items/:itemId` | Update item quantity |
| DELETE | `/cart/items/:itemId` | Remove item |
| DELETE | `/cart` | Clear entire cart |

### Operations

```ts
// Get cart with items
prisma.cart.findUnique({
  where: { userId },
  include: {
    items: { include: { product: true } }
  }
})

// Add item — upsert handles duplicate products
prisma.cartItem.upsert({
  where: { cartId_productId: { cartId, productId } },
  create: { cartId, productId, quantity },
  update: { quantity: { increment: quantity } }
})

// Update quantity
prisma.cartItem.update({
  where: { id: itemId },
  data: { quantity }
})

// Remove item
prisma.cartItem.delete({ where: { id: itemId } })

// Clear cart
prisma.cartItem.deleteMany({ where: { cartId } })
```

---

## Orders

### Endpoints

| Method | Endpoint | Access |
|---|---|---|
| GET | `/orders` | Own orders (customer), all orders (admin) |
| GET | `/orders/:id` | Own order detail |
| POST | `/orders` | Checkout |
| PATCH | `/orders/:id/status` | Admin only |
| DELETE | `/orders/:id` | Admin only |

### Checkout Operation

The most critical operation. Uses a transaction so everything either succeeds or rolls back together.

```ts
prisma.$transaction(async (tx) => {
  const cart = await tx.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } }
  })

  if (!cart || cart.items.length === 0) throw new Error("Cart is empty")

  // Check stock for all items
  for (const item of cart.items) {
    if (item.product.stock < item.quantity) {
      throw new Error(`${item.product.name} is out of stock`)
    }
  }

  const total = cart.items.reduce((sum, item) => {
    return sum + Number(item.product.price) * item.quantity
  }, 0)

  // Create order with snapshot prices
  const order = await tx.order.create({
    data: {
      userId,
      addressId,
      total,
      items: {
        create: cart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price // snapshot price at time of order
        }))
      }
    }
  })

  // Decrement stock
  for (const item of cart.items) {
    await tx.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } }
    })
  }

  // Clear cart
  await tx.cartItem.deleteMany({ where: { cartId: cart.id } })

  return order
})
```

### Other Order Operations

```ts
// Get orders
prisma.order.findMany({
  where: { userId }, // remove for admin to get all
  include: {
    items: { include: { product: true } },
    address: true
  },
  orderBy: { createdAt: "desc" }
})

// Update status (admin)
prisma.order.update({
  where: { id: orderId },
  data: { status: "SHIPPED" }
})
```

### Order Status Flow

```
PENDING → PROCESSING → SHIPPED → DELIVERED
                ↓
           CANCELLED
```

---

## Access Control Summary

| Resource | Public | Customer | Admin |
|---|---|---|---|
| Categories | GET | — | POST, PATCH, DELETE |
| Products | GET | — | POST, PATCH, DELETE |
| Auth | POST | — | — |
| Users | — | GET own, PATCH own | GET all, DELETE |
| Addresses | — | Full CRUD own | — |
| Cart | — | Full CRUD own | — |
| Orders | — | GET own, POST | GET all, PATCH status, DELETE |