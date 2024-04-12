const express = require("express");
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;
const uri = "mongodb+srv://anjaliburu:anjali123@cluster0.t4sgekm.mongodb.net/?retryWrites=true&w=majority";

let collection;

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false}));

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function runDBConnection() {
    try {
        await client.connect();
        collection = client.db().collection('fruits');
        console.log("Connected to MongoDB");


        const count = await collection.countDocuments();
        if (count === 0) {
            await collection.insertMany([
                {
                    title: "fruit 2",
                    image: "images/image 2.png",
                    link: "About image 2",
                    description: "I am pomegranate"
                },
                {
                    title: "fruit 3",
                    image: "images/image 3.png",
                    link: "About image 3",
                    description: "I am kiwi"
                }
            ]);
            console.log("Initial fruit data inserted into MongoDB");
        }
    } catch (ex) {
        console.error("Error connecting to MongoDB:", ex);
    }
}

runDBConnection().catch(console.error);

app.post('/api/cards', async (req, res) => {
    try {
        const newCard = req.body;
        const result = await collection.insertOne(newCard);
        console.log("New card added:", newCard);
        res.json({ success: true, message: 'card added successfully' });
    } catch (error) {
        console.error("Error adding card:", error);
        res.status(500).json({ success: false, message: 'Failed to add card' });
    }
});

app.get('/api/cards', async (req, res) => {
    try {
        const cards = await collection.find({}).toArray();
        res.json({ success: true, data: cards });
    } catch (error) {
        console.error("Error fetching cards:", error);
        res.status(500).json({ success: false, message: 'Failed to fetch cards' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});