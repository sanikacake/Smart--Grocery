const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

const app = express();
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://groceryadmin:grocery123@cluster0.lrmkhep.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let products; // global collection

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    const db = client.db("groceryDB");
    products = db.collection("products");

  } catch (error) {
    console.error(error);
  }
}

connectDB();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/products", async (req, res) => {
  try {
    const data = await products.find().toArray();
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching products");
  }
});

const { ObjectId } = require("mongodb");

app.delete("/products/:id", async (req, res) => {
  const id = req.params.id;

  const result = await products.deleteOne({
    _id: new ObjectId(id)
  });

  res.send(result);
}); 

app.post("/products", async (req, res) => {
  try {
    const newProduct = req.body;
    const result = await products.insertOne(newProduct);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding product");
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});