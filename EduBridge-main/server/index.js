const express = require("express");
const cors = require("cors");

// Route Imports
const schoolRoutes = require("./routes/schools");
const volunteerRoutes = require("./routes/volunteers");
const donationRoutes = require("./routes/donations");
const feedbackRoutes = require("./routes/feedback");
const adminRoutes = require("./routes/admin");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount Routes
app.use("/api/schools", schoolRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/admin", adminRoutes);

// Base Route
app.get("/", (req, res) => {
  res.json({
    message: "HelpingHands API Running 🚀 (JSON Mode)"
  });
});

// CRITICAL FOR RENDER DEPLOYMENT:
// Render dynamically assigns a port. Even without dotenv, Node provides this in production.
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 HelpingHands Server running on port ${PORT}`);
});