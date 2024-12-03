
const { MongoClient, ServerApiVersion } = require('mongodb');
import dotenv from 'dotenv';
dotenv.config();
const backup = "mongodb+srv://glowpathuser:1f0gCnPMKhYfn5OL@gpcluster.xot4d.mongodb.net/?retryWrites=true&w=majority&appName=GPCluster"
const uri = process.env.MONGODB_URI || backup
console.log('uri is ', backup)
console.log('backup uri is ', )
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(backup, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const DBConnect = async () => {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
//run().catch(console.dir);
export default DBConnect
