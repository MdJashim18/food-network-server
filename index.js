const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// MongoDB URI
const uri = "mongodb+srv://Food-Network:m2EPYv3cTBhSQsZu@mongo-simple-crud.tzwys72.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        await client.connect();

        const db = client.db("Food-Network");
        const foodCollections = db.collection("foods");

        console.log(" Connected to MongoDB successfully!");

        // Default route
        app.get('/', (req, res) => {
            res.send('🍽️ Local Food Lovers Network is running!');
        });

        
        app.post('/foods', async (req, res) => {
            const newFood = req.body;
            const result = await foodCollections.insertOne(newFood);
            res.send(result)
        });

        app.delete('/foods/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await foodCollections.deleteOne(query)
            res.send(result)
        });

        app.patch('/foods/:id', async (req, res) => {
            const id = req.params.id
            const updateFood = req.body
            const query = { _id: new ObjectId(id) }

            const update = {
                $set: {
                    title: updateFood.title,
                    price_min: updateFood.price_min,
                    price_max: updateFood.price_max,
                }
            }
            const options = {}
            const result = await foodCollections.updateOne(query, update, options)
            res.send(result)
        });

        app.get('/foods',async(req,res)=>{
            const cursor = foodCollections.find()
            const result = await cursor.toArray()
            res.send(result)
        });

        app.get('/foods/:id',async(req,res)=>{
            const id = req.params.id
            const query = {_id:new ObjectId(id)}
            const result = await foodCollections.findOne(query)
            res.send(result)
        })






        
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}

run().catch(console.dir);
