const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

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
    const donateUserCollection = client
      .db("campaignDB")
      .collection("userDonation");
    //  read for single one
    app.get("/details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await campaignCollection.findOne(query);
      res.send(result);
    });
    app.post("/myDonate", async (req, res) => {
      try {
        const donate = req.body;
        const result = await donateUserCollection.insertOne(donate);
        res.send(result);
      } catch (error) {
        console.log(error, "error donate user");
      }
    });
    // Read data for showing on client side
    app.get("/campaigns", async (req, res) => {
      const cursor = campaignCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // donation
    app.get("/myDonate/:email", async (req, res) => {
      const query = donateUserCollection.find({ email: req.params.email });
      const result = await query.toArray();
      res.send(result);
    });

    app.get("/runningCampaign", async (req, res) => {
      const cursor = campaignCollection.find().limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });

    // create an api (first)
    app.post("/campaigns", async (req, res) => {
      const newCampaign = req.body;
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
