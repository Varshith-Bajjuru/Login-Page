import express from "express"
import pg from "pg"
import bodyParser from "body-parser"
import { dirname } from "path";
import { fileURLToPath } from "url";

const port = 3000
const app = express()

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"));

const db = new pg.Client({
    user : "postgres",
    host : "localhost",
    database : "varshith",
    password : "varshith@123",
    port : 5432
})
db.connect()

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/views/login.html"); 
});
app.post('/success',async (req,res)=>{
    const username = req.body.username
    const password = req.body.password
    const result = await db.query("SELECT answer FROM login WHERE username = $1 AND passcode = $2;",
        [username,password]
    )
    if (result.rows.length > 0 && result.rows[0].answer === 'yes') {
        res.sendFile(__dirname + "/views/success.html");
    } else if(result.rows.length == 0) {
        res.sendFile(__dirname + "/views/failure.html");
    }
})

app.get("/adduser",(req,res)=>{
    res.sendFile(__dirname+ "/views/getuser.html")
})

app.post("/getuser",async (req,res)=>{
    const name = req.body.username
    const pass = req.body.password
    const details = await db.query("INSERT INTO login (username,passcode) VALUES ($1,$2)",
        [name,pass]
    )
    res.redirect("/")
})

app.listen(port,(err)=>{
    if(err){
        console.log(err)
    }
    else{
        console.log(`Server is running on port ${port}`)
    }
})