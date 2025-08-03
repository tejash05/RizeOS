const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/ai', require('./routes/ai')); 
app.use("/uploads", express.static("uploads"));
app.use("/api/payments", require("./routes/payment"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/applications", require("./routes/applications"));
app.use("/api/users", require("./routes/users"));


const PORT = process.env.PORT || 5050;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error('❌ Mongo Error:', err));
