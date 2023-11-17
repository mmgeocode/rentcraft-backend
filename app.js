require("dotenv").config();
const express = require("express");
const app = express();
const tenantsController = require("./controllers/tenants.controller");
const cors = require("cors");
const userController = require("./controllers/user.controller");
const unitController = require("./controllers/unit.controller");
const paymentsController = require("./controllers/payments.controller"); 
const contact = require("./controllers/contacts") 
const reset = require("./services/auth.service")

const mongoose = require("mongoose");

const PORT = process.env.PORT;
const DBName = process.env.DB_Name;
const DB_URL = process.env.DB_URL;


mongoose.connect(DB_URL + DBName);

const db = mongoose.connection;

db.once("open", () => {
  console.log("connected to the DB", DBName);
});

app.use(cors());
app.use(express.json()); 

app.use("/contact", contact)
app.use("/tenants", tenantsController);
app.use("/user", userController);
app.use("/unit", unitController);
app.use("/payments", paymentsController); 
app.use("/services", reset)


app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
