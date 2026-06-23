
---

### User
Same as before but now has three roles: CUSTOMER, SELLER, and ADMIN. A user can optionally have a `Seller` profile — meaning a seller is still a User underneath, just with an extra profile attached. When building your auth logic, after login always check the role to redirect to the right portal (customer, seller, or admin).

---

### Seller
An extension of User — one-to-one relationship via `userId @unique`. Created separately after a user registers and applies to become a seller. Has a `status` (PENDING, APPROVED, REJECTED, SUSPENDED) controlled by the admin. A seller cannot list products until their status is APPROVED. Key fields:
- `storeName` — unique across the platform, like a shop username
- `commission` — the platform's cut per sale (default 10%), set per seller so admin can negotiate different rates
- `status` — your middleware should check this before allowing any seller actions

**Logic to implement:**
- Seller registration creates a Seller record with PENDING status
- Admin approves or rejects
- Only APPROVED sellers can create products
- SUSPENDED sellers' products should be hidden from customers

---

### Product
Now belongs to both a Seller and a Category. The key addition is `sellerId` — every product is owned by a specific seller. Also has `isActive` — sellers can toggle their products without deleting them. Things to validate in your service:
- Only the owning seller can edit or delete their product
- Admin can manage any product
- Filter out `isActive: false` products from public listings
- Filter out products from SUSPENDED sellers from public listings

---

### SellerOrder
This is the new junction between an Order and a Seller. When a customer checks out with items from multiple sellers, one Order is created but multiple SellerOrders are created — one per seller involved. This is exactly how Shopee and Lazada work.

Example: Customer buys a keyboard from Seller A and a book from Seller B. One Order is created, but two SellerOrders are created — one for Seller A, one for Seller B. Each seller only sees their own SellerOrder.

Key fields:
- `status` — each seller manages their own fulfillment status independently
- `subtotal` — total for that seller's items only
- `commission` — the platform cut taken from that seller's subtotal

**Logic to implement:**
- At checkout, group cart items by `sellerId`
- Create one SellerOrder per seller group
- Each SellerOrder gets its own status, managed by that seller
- Commission is calculated as `subtotal × seller.commission`
- Seller's actual earnings = `subtotal - commission`

---

### Order
Still the top-level order tied to the Customer and their Address. Now also has `sellerOrders` — the breakdown per seller. The `total` is still the full amount the customer pays. The Order status can represent the overall fulfillment (e.g., only DELIVERED when all SellerOrders are delivered).

---

### OrderItem
Now linked to both an Order and a SellerOrder. This is important — it tells you which seller fulfills each item. The price snapshot logic stays the same. When querying a seller's orders, you go through SellerOrder → OrderItems to get only their items.

---

## Updated Key Logic Rules

**Checkout is now more complex** — after validating stock and calculating total, you must: group items by seller → create one SellerOrder per group → calculate commission per SellerOrder → create OrderItems linked to both Order and SellerOrder → decrement stock → clear cart. Still all in one transaction.

**Access control per portal:**

| Action | Customer | Seller | Admin |
|---|---|---|---|
| View products | All active | Own only | All |
| Create product | ❌ | Own store only | ✅ |
| View orders | Own orders | Own SellerOrders | All |
| Update order status | ❌ | Own SellerOrder only | All |
| Approve sellers | ❌ | ❌ | ✅ |
| Manage categories | ❌ | ❌ | ✅ |

**Commission calculation** — at checkout, for each SellerOrder: `commission = subtotal × seller.commissionRate`. Store this on the SellerOrder at time of purchase, not dynamically — same reason as price snapshots, the rate could change later.

**Seller middleware** — create a dedicated middleware that checks: user role is SELLER and seller status is APPROVED. Apply this to all seller product and order routes.

**Product visibility rules** — a product should only appear in public listings if: `isActive: true` AND seller status is `APPROVED`. Build this into your base product query.