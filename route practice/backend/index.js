require("dotenv").config({ path: "../.env" });
const express = require("express");
const mongoose = require("mongoose");
const { UserRouter } = require("./Routers/user");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const session = require('express-session');
const app = express();
app.use(express.json());
app.use(helmet());
app.use(cookieParser());



app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.Second_url,process.env.Third_url,process.env.fourht_url,process.env.fifth_url],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "Cookie",
    ],
    exposedHeaders: ["Content-Range", "X-Content-Range", "Set-Cookie"],
    maxAge: 86400, // 24 hours
  })
);

app.use(session({
	secret :process.env.SESSION_SECRET,
	reserve : true,
	saveUninitialized: false,
	cookie: {
		secure :false,
		httpOnly: true,
		maxAge : 24 * 60 * 60 * 1000
	}
}))
app.use((req, res, next) => {
    console.log('Session:', req.sessionID);
    next();
});
// Request timeout
app.use((req, res, next) => {
  req.setTimeout(5000, () => {
    res.status(408).json({ message: "Request timeout" });
  });
  next();
});

// Routes
app.use("/user", UserRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});


async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connected to database ");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.log("unable to connect to the database\n", err);
  }
}
main();
