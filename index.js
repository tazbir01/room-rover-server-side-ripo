const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors')
require('dotenv').config()

// middleware
app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ujho7bh.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    const roomRoverCollection = client.db('roomroverDB').collection('rooms')
    const bookCollection = client.db('roomroverDB').collection('mybooking')

    app.get('/rooms', async(req,res)=>{
      const cursor = roomRoverCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/rooms/:id', async(req, res)=>{
      const id = req.params.id;
      const cursor = {_id: new ObjectId(id)}
      const result = await roomRoverCollection.findOne(cursor)
      res.send(result)
    })

    // mybokkings api
    app.post('/mybookings', async(req, res)=>{
      const mybookingRoom = req.body
      console.log(mybookingRoom)
      const result = await bookCollection.insertOne(mybookingRoom)
      res.send(result)
    })

    app.get('/mybookings', async(req,res)=>{
      const cursor = bookCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/mybookings/:id', async(req,res)=>{
      const id = req.params.id;
      const cursor = {_id: new ObjectId(id)}
      const result = await bookCollection.findOne(cursor)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('RoomRover server is running')
})

app.listen(port, ()=>{
    console.log(`server is running on port: ${port}`)
})