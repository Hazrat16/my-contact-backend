const express = require("express");
const { connectDb } = require("./config/dbConnection");

const dotenv = require("dotenv").config();

connectDb();
const app = express();

const port = process.env.PORT || 5000 ;


app.use(express.json())

app.use("/v1/api/contacts",require("./routes/contactRoutes"));
app.use("/v1/api/users",require("./routes/userRoutes"));

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})
