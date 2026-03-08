const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const path = require("path");

const app = express();   // ✅ create app FIRST

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const uri = "mongodb+srv://groceryadmin:grocery123@cluster0.lrmkhep.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let products;

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
    console.log(error);
    res.status(500).send("Error fetching products");
  }
});

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
    const result = await products.save(newProduct);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding product");
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});