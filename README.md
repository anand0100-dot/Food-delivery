# Food Delivery System 🍔

A responsive, interactive, and modern web interface for a **Food Delivery System** built with **HTML5, CSS3, Bootstrap 5, and JavaScript**.

This project demonstrates core web development concepts, including semantic HTML structure, modern flexbox & grid design, responsive layouts, dynamic DOM updates, interactive shopping cart management, multi-criteria menu filtering, Bootstrap modals/carousels, and comprehensive client-side form validation using **Regular Expressions (Regex)**.

---

## 🛠 Technology Stack

| Technology | Purpose |
| :--- | :--- |
| 🌐 **HTML5** | Semantic web page structure and accessible markup |
| 🎨 **CSS3** | Custom design system, CSS variables, glassmorphism, animations, and transitions |
| ⚡ **Bootstrap 5** | Responsive grid system, navbar, cards, carousel, and modals |
| 🧠 **JavaScript (ES6+)** | Dynamic DOM manipulation, food filtering logic, shopping cart calculation, regex form validation |
| ⚙️ **Node.js + Express** | REST API, static site hosting, orders and contact submissions |
| 🍃 **MongoDB (optional)** | Persistent orders and contact messages |
| 🖼 **Bootstrap Icons** | Visual UI icons |
| 🔤 **Google Fonts** | Typography (`Poppins` and `Inter`) |

---

## 📂 Project Structure

```text
Food-Delivery-System/
│
├── backend/            # Express REST API and MongoDB-ready persistence
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── index.html          # Main HTML structure with Bootstrap 5 components
├── css/
│   └── style.css       # Custom styling, design tokens, responsive rules & validation UI
├── js/
│   └── script.js       # Dynamic menu data, filtering, shopping cart & regex form validation
├── images/             # Food image assets
│   ├── burger.jpg
│   ├── pizza.jpg
│   └── offer1.jpg
└── README.md           # Project documentation and exercise solutions
```

---

## ✨ Features Implemented

1. **Responsive Sticky Navbar**:
   - Glassmorphism background effect with backdrop blur.
   - Smooth navigation scrolling to all sections (`#restaurants`, `#offers`, `#menu`, `#cart`, `#contact`).
   - Live food search input with instant filtering.
   - Dynamic cart badge counter with pulse animation on item add.

2. **Hero Section**:
   - Hero banner with overlay typography, search bar, and feature badges (30-min fast delivery, 100% hygienic, daily offers).

3. **Popular Restaurants Section**:
   - Responsive Bootstrap card grid showing top dining spots with ratings, cuisine tags, and delivery time indicators.

4. **Special Offers Carousel**:
   - Interactive Bootstrap 5 carousel showcasing promotional discount banners and deals.

5. **Interactive Food Menu with Multi-Criteria Filters**:
   - Category filtering (All, Veg 🌱, Non-Veg 🍖).
   - Cuisine filtering (Italian, Indian, American, Asian).
   - Price & Rating sorting (Low to High, High to Low, Top Rated).
   - Real-time search by food dish name, cuisine, or description.

6. **Food Details Modal**:
   - Dynamic Bootstrap Modal displaying full food image, price, veg/non-veg status, preparation time, description, ingredients list, and direct "Add to Cart" button.

7. **Dynamic Shopping Cart**:
   - Add/Remove food items with real-time UI updates.
   - Quantity controls (`+` and `-`) for each item.
   - Automated bill breakdown: Subtotal, Delivery Fee (Free over ₹500), Discount Vouchers, Tax (5% GST), and Grand Total.
   - Empty cart state with quick "Browse Menu" button.
   - Clear Cart button.
   - Interactive Checkout flow launching an Order Confirmation Modal with generated Order ID.

8. **Contact Form with Regex Validation (Exercises 1 - 5)**:
   - Full real-time input feedback (`is-valid-custom` vs `is-invalid-custom`).
   - Prevention of invalid form submissions.

---

## 📝 Practice Exercises Implementation

The Contact Us form integrates solutions for all 5 practice exercises:

### 📝 Exercise 1: Contact Form Validation
- Ensures all required fields (`Name`, `Email`, `Mobile`, `Password`) are validated prior to submission.
- Minimum name length enforced (at least 2 characters).

### ✉️ Exercise 2: Email Validation
- Validates the email format using Regular Expressions:
  ```javascript
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  ```

### 📱 Exercise 3: Mobile Number Validation
- Validates a 10-digit mobile number using Regex (Indian standard starting with digits 6-9):
  ```javascript
  const mobileRegex = /^[6-9]\d{9}$/;
  ```

### 🔑 Exercise 4: Password Validation
- Validates password complexity using Regex:
  ```javascript
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  ```
  - **Rules Enforced**:
    - Minimum 8 characters
    - At least 1 uppercase letter (`[A-Z]`)
    - At least 1 lowercase letter (`[a-z]`)
    - At least 1 digit (`\d`)
    - At least 1 special character (`[@$!%*?&]`)

### 🚫 Exercise 5: Prevent Invalid Submission
- Uses `e.preventDefault()` inside the form `submit` event listener to intercept form submission.
- Evaluates all fields against validation rules. If any rule fails, submission is blocked and field-level error messages are displayed.
- On valid submission, displays a success notification alert and resets form fields cleanly.

---

## 🚀 How to Run the Project

1. Run `cd backend && npm install && npm start`.
2. Open `http://localhost:3000`. Express hosts the frontend and API together.
3. To persist data with MongoDB, copy `backend/.env.example` to `backend/.env` and set `MONGODB_URI`. Without it, the project uses in-memory storage for demonstration.
4. The app loads its menu from `GET /api/menu`, creates orders through `POST /api/orders`, and sends contact messages through `POST /api/contacts`.
