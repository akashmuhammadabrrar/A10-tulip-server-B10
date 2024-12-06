const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c4n3e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // create the data cluster
    const campaignCollection = client.db("campaignDB").collection("campaign");

    // create an api (first)
    app.post("/campaigns", async (req, res) => {
      const newCampaign = req.body;
      console.log(newCampaign);
      const result = await campaignCollection.insertOne(newCampaign);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// middleware
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("hello form home route campaigns");
});

app.listen(port, () => {
  console.log(`Server is running on port:${port}`);
});
