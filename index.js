const express = require("express")
const app = express()
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const cors = require("cors")
const apiRoute = require("./routes/api_routes")

const PORT = "2000"

app.use(express.json(), cors())

app.use("/app/users", apiRoute)

app.get("/", (req,res) => {
    res.send("Running Employee Management System")
})

app.listen(PORT, () =>
    console.log(`Server is running at ${PORT}`)
)

dotenv.config()

mongoose.connect(
    process.env.DB_CONNECT,
    {useNewUrlParser:true},
    () => console.log("Connected to Database")
)
