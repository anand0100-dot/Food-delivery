// ==========================================
// FOOD DELIVERY SYSTEM BACKEND
// NODE.JS + EXPRESS + MONGODB
// ==========================================
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================
app.use(cors());
app.use(express.json());

// ==========================================
// DATABASE CONNECTION
// ==========================================
mongoose
  .connect("mongodb://127.0.0.1:27017/foodDeliveryDB")
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.log("MongoDB Connection Error:", error.message);
  });

// ==========================================
// RESTAURANT SCHEMA
// ==========================================
const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cuisine: { type: String, required: true },
  location: { type: String, required: true }
});
const Restaurant = mongoose.model("Restaurant", restaurantSchema);

// ==========================================
// MENU SCHEMA
// ==========================================
const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  cuisine: { type: String, required: true },
  price: { type: Number, required: true },
  veg: { type: Boolean, required: true }
});
const Menu = mongoose.model("Menu", menuSchema);

// ==========================================
// CART SCHEMA
// ==========================================
const cartSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  total: { type: Number, required: true }
});
const Cart = mongoose.model("Cart", cartSchema);

// ==========================================
// RESTAURANT APIs
// ==========================================
// CREATE RESTAURANT
app.post("/restaurants", async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    res.status(201).json({ message: "Restaurant Added Successfully", restaurant });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET ALL RESTAURANTS
app.get("/restaurants", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE RESTAURANT
app.put("/restaurants/:id", async (req, res) => {
  try {
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedRestaurant) {
      return res.status(404).json({ message: "Restaurant Not Found" });
    }
    res.status(200).json(updatedRestaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE RESTAURANT
app.delete("/restaurants/:id", async (req, res) => {
  try {
    const deletedRestaurant = await Restaurant.findByIdAndDelete(
      req.params.id
    );
    if (!deletedRestaurant) {
      return res.status(404).json({ message: "Restaurant Not Found" });
    }
    res.status(200).json({ message: "Restaurant Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// MENU APIs
// ==========================================
// CREATE MENU ITEM
app.post("/menu", async (req, res) => {
  try {
    const menu = new Menu(req.body);
    await menu.save();
    res.status(201).json({ message: "Menu Item Added", menu });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET ALL MENU ITEMS
app.get("/menu", async (req, res) => {
  try {
    const menu = await Menu.find();
    res.status(200).json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// FILTER MENU ITEMS
app.get("/menu/filter", async (req, res) => {
  try {
    const { veg, cuisine, minPrice, maxPrice } = req.query;
    let filter = {};

    // VEG / NON-VEG FILTER
    if (veg !== undefined) {
      filter.veg = veg === "true";
    }

    // CUISINE FILTER
    if (cuisine) {
      filter.cuisine = cuisine;
    }

    // PRICE FILTER
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }
      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    const menu = await Menu.find(filter);
    res.status(200).json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE MENU ITEM
app.put("/menu/:id", async (req, res) => {
  try {
    const updatedMenu = await Menu.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedMenu) {
      return res.status(404).json({ message: "Menu Item Not Found" });
    }
    res.status(200).json(updatedMenu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE MENU ITEM
app.delete("/menu/:id", async (req, res) => {
  try {
    const deletedMenu = await Menu.findByIdAndDelete(
      req.params.id
    );
    if (!deletedMenu) {
      return res.status(404).json({ message: "Menu Item Not Found" });
    }
    res.status(200).json({ message: "Menu Item Deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// CART APIs
// ==========================================
// ADD ITEM TO CART
app.post("/cart", async (req, res) => {
  try {
    const { itemName, quantity, price } = req.body;
    if (!itemName || !quantity || price === undefined) {
      return res.status(400).json({ message: "itemName, quantity and price are required" });
    }
    const total = quantity * price;
    const cartItem = new Cart({ itemName, quantity, price, total });
    await cartItem.save();
    res.status(201).json({ message: "Item Added to Cart", cartItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET CART ITEMS
app.get("/cart", async (req, res) => {
  try {
    const cartItems = await Cart.find();
    const grandTotal = cartItems.reduce(
      (sum, item) => sum + item.total,
      0
    );
    res.status(200).json({ cartItems, grandTotal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE CART ITEM
app.put("/cart/:id", async (req, res) => {
  try {
    const { quantity, price } = req.body;
    const total = quantity * price;
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      { quantity, price, total },
      { new: true, runValidators: true }
    );
    if (!updatedCart) {
      return res.status(404).json({ message: "Cart Item Not Found" });
    }
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE CART ITEM
app.delete("/cart/:id", async (req, res) => {
  try {
    const deletedCart = await Cart.findByIdAndDelete(
      req.params.id
    );
    if (!deletedCart) {
      return res.status(404).json({ message: "Cart Item Not Found" });
    }
    res.status(200).json({ message: "Cart Item Removed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 404 ERROR HANDLING
// ==========================================
app.use((req, res) => {
  res.status(404).json({ message: "API Route Not Found" });
});

// ==========================================
// START SERVER
// ==========================================
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n[ERROR] Port ${PORT} is already in use!`);
    console.error(`Mac users: macOS AirPlay Receiver uses port 5000.`);
    console.error(`To fix: Go to System Settings -> General -> AirDrop & AirPlay -> Turn OFF 'AirPlay Receiver'.`);
    console.error(`Or start with: PORT=5001 node server.js\n`);
  } else {
    console.error('Server error:', err);
  }
});
