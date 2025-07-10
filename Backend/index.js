import express from "express"
const app = express();
import db from "./module/db.js";
import authRoutes from "./controller/auth_Phase1.js";
import authRoute2 from "./controller/auth_phase2.js";
const port = process.env.PORT || 3000

app.use(express.json());
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    console.log("Api is running");
    // res.send("Api is running");
    res.render("index")

})

//Base route
app.use('/api/auth1', authRoutes);
app.use('api/auth2', authRoute2)
app.listen(port, () => {
    console.log("server running on:", port);
})