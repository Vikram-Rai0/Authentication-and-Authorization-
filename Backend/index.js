import express from "express"
const app = express();
import dotenv from "dotenv"
import authRoutes from "./controller/auth.js";
const port = process.env.PORT || 3000

app.use(express.json());

app.get('/', (req, res) => {
    console.log("Api is running");
    res.send("Api is running");
})

//Base route
app.use('/api/auth',authRoutes);
app.listen(port, () => {
    console.log("server running on:", port);
})