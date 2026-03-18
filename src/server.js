require("dotenv").config();

const express = require("express");
const cors = require("cors");
const testRoutes = require("./routes/test.routes");
const userRoutes = require("./routes/user.routes");
const trainerRoutes = require("./routes/trainer.routes");
const authRoutes = require("./routes/auth.routes");
const planRoutes = require("./routes/plan.routes");
const clientRoutes = require("./routes/client.routes");
const sessionRoutes = require("./routes/session.routes");


const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/v1/test", testRoutes);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("FitPro backend is running");
});

app.use("/api/v1/auth", authRoutes);

const PORT = process.env.PORT || 5000;
console.log("sessionRoutes loaded");

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/trainer", trainerRoutes);
app.use("/api/v1/trainer/plans", planRoutes);
app.use("/api/v1/client", clientRoutes);
app.use("/api/v1/sessions", sessionRoutes);