const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://inventory-management-354ce.web.app'
    ],
    credentials: true
}));

// MongoDB setup
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://inventory_manegment:TBVFQ4dTHNFzSLMn@atlascluster.aasa6jh.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Async function to handle routes and MongoDB connection
async function run() {
    try {
        await client.connect(); // Connect to MongoDB
        const userCollection = client.db('inventory_management').collection('users');
        const postCollection = client.db('inventory_management').collection('allpost');
        const contactCollection = client.db('inventory_management').collection('contact');
        const productCollection = client.db('inventory_management').collection('product');
        const selproductCollection = client.db('inventory_management').collection('selproduct');

        // Route to add a new user
        app.post('/users', async (req, res) => {
            try {
                const data = req.body;
                const query = { email: data.email };
                const existing = await userCollection.findOne(query);

                if (existing) {
                    return res.status(409).json({ message: 'User already exists', insertedId: null });
                }

                const result = await userCollection.insertOne(data);
                res.status(201).json(result);

            } catch (error) {
                console.error('Error in POST /user:', error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
        app.post('/adminpost', async (req, res) => {
            const data = req.body;
            const result = await postCollection.insertOne(data)
            res.send(result)
        })
        app.post('/addproduct', async (req, res) => {
            const data = req.body;
            const result = await productCollection.insertOne(data)
            res.send(result)
        })
        app.get('/getproduct', async (req, res) => {
            const result = await productCollection.find().toArray()
            res.send(result)
        })
        app.get('/singalgetproduct/:id', async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.findOne(query)
            res.send(result)
        })

        app.delete('/deleteproduct/:id', async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.deleteOne(query)
            res.send(result)
        })

        app.patch('/updateproduct/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const data = req.body;
            const option = { upsert: true }
            console.log(data)
            const updateDoc = {
                $set: {
                    number: data.producctNumber,
                    updateEmail: data.email,
                    updateupdatedate: data.updatedate
                }
            }
            const result = await productCollection.updateOne(filter, updateDoc, option);
            res.send(result)
        })

        // sel product 
        app.post('/selproduct', async (req, res) => {
            const data = req.body;
            const result = await selproductCollection.insertOne(data)
            res.send(result)
        })
        // get sel product
        app.get('/getselproduct', async (req, res) => {
            const result = await selproductCollection.find().toArray()
            res.send(result)
        })
        app.get('/getselproductid/:id', async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: new ObjectId(id) }
            const result = await selproductCollection.findOne(query)
            res.send(result)
        })

        app.post('/contact', async (req, res) => {
            const data = req.body;
            const result = await contactCollection.insertOne(data)
            res.send(result)
        })
        app.get('/getcontact', async (req, res) => {
            const result = await contactCollection.find().toArray()
            res.send(result)
        })
        app.get('/adminpostget', async (req, res) => {
            const result = await postCollection.find().toArray()
            res.send(result)
        })
        app.delete('/adminpostgetdelete/:id', async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: new ObjectId(id) }
            const result = await postCollection.deleteOne(query)
            res.send(result)
        })

        app.get('/getuser', async (req, res) => {
            const users = await userCollection.find().toArray()
            res.send(users)
        })


        app.get('/user/admin/:email', async (req, res) => {
            // 68-9 modul
            const email = req?.params?.email;
            console.log(email)
            if (!email) {
                return res.status(400).send({ error: 'Email parameter is required' });
            }

            try {
                const query = { email: email };
                const user = await userCollection.findOne(query);

                if (!user) {
                    return res.status(404).send({ error: 'User not found' });
                }

                let admin = false;

                if (user) {

                    admin = user.role === 'admin'; // Check if the user role is admin
                }
                res.send({ admin });
            } catch (error) {
                console.error('Error fetching user:', error);
                res.status(500).send({ error: 'Internal Server Error' });
            }
        });
        app.get('/user/supervisor/:email', async (req, res) => {
            // 68-9 modul
            const email = req?.params?.email;
            console.log(email)
            if (!email) {
                return res.status(400).send({ error: 'Email parameter is required' });
            }

            try {
                const query = { email: email };
                const user = await userCollection.findOne(query);

                if (!user) {
                    return res.status(404).send({ error: 'User not found' });
                }

                let supervisor = false;

                if (user) {

                    supervisor = user.role === 'supervisor'; // Check if the user role is admin
                }
                res.send({ supervisor });
            } catch (error) {
                console.error('Error fetching user:', error);
                res.status(500).send({ error: 'Internal Server Error' });
            }
        });


        app.get('/user/marketing/:email', async (req, res) => {
            // 68-9 modul
            const email = req?.params?.email;
            console.log(email)
            if (!email) {
                return res.status(400).send({ error: 'Email parameter is required' });
            }

            try {
                const query = { email: email };
                const user = await userCollection.findOne(query);

                if (!user) {
                    return res.status(404).send({ error: 'User not found' });
                }

                let marketing = false;

                if (user) {

                    marketing = user.role === 'marketing'; // Check if the user role is admin
                }
                res.send({ marketing });
            } catch (error) {
                console.error('Error fetching user:', error);
                res.status(500).send({ error: 'Internal Server Error' });
            }
        });

        app.get('/contactdetailpage/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await contactCollection.findOne(query)
            res.send(result)
        })
        app.get('/detailuser/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await userCollection.findOne(query)
            res.send(result)
        })


        app.patch('/updateuser/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const data = req.body;
            const option = { upsert: true }
            console.log(data)
            const updateDoc = {
                $set: {
                    role: data.role,
                }
            }
            const result = await userCollection.updateOne(filter, updateDoc, option);
            res.send(result)
        })



        app.delete('/userdelete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result)
        });


        app.get('/user/worker/:email', async (req, res) => {
            // 68-9 modul
            const email = req?.params?.email;
            console.log(email)
            if (!email) {
                return res.status(400).send({ error: 'Email parameter is required' });
            }

            try {
                const query = { email: email };
                const user = await userCollection.findOne(query);

                if (!user) {
                    return res.status(404).send({ error: 'User not found' });
                }

                let worker = false;

                if (user) {

                    worker = user.role === 'worker'; // Check if the user role is admin
                }
                res.send({ worker });
            } catch (error) {
                console.error('Error fetching user:', error);
                res.status(500).send({ error: 'Internal Server Error' });
            }
        });





        await client.db("admin").command({ ping: 1 });
        console.log("Successfully connected to MongoDB!");
    } finally {
        // Close client when finished or on error
        // await client.close(); // Uncomment if you want to close the connection after each use
    }
}
run().catch(console.error);

// Root route
app.get('/', (req, res) => {
    res.send('inventory_manegment');
});

// Server setup
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
