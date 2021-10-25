const express =require ('express');
const { MongoClient} = require('mongodb');
const cors=require('cors')
const app = express();
const port=5000;

// middleware
app.use(cors());
app.use(express.json());
const ObjectId=require('mongodb').ObjectId;

// cannect
const uri = "mongodb+srv://fatehAhmod:DTWq9uCTCU0NBue0@cluster0.n0kiz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("myweb").collection("users");
//   // perform actions on the collection object
//   console.log('hitting the dabase');
//   const user ={name:'kkkkk',email:'kkkkkk@gmail.com'};
//   collection.insertOne(user)
//   .then(()=>{
//       console.log('insert sucess');
//   })
// //   console.error(err)
//   // client.close();
// });

async function run() {
    try {
      await client.connect();
      const database = client.db("foodB");
      const usersCollection = database.collection("users");
      // create a document to insert
      // const doc = {
      //   name: "tum",
      //   email: "gsa@gmail.com",
      // }
      // const result = await haiku.insertOne(doc);
      // console.log(` _id: ${result.insertedId}`);

      // get Api
      app.get('/users', async(req,res)=>{
        const cursor=usersCollection.find({});
        const users=await cursor.toArray();
        res.send(users);
      })

      //post Api
      app.post('/users', async(req, res)=>{
        const newUser=req.body;
        const result =await usersCollection.insertOne(newUser);
        // console.log('got new user');
        console.log('got new users',req.body);
        console.log('added users',result);
        res.json('hit the post');

      })
      app.get('/users/:id', async(req,res)=>{
        const id =req.params.id;
        const qurey={_id:ObjectId(id)};
        const user= await usersCollection.findOne(qurey);
        console.log('load user',id);
        res.send(user)
      })

      // put Api 0r update
      app.put('/users/:id',async(req,res)=>{
        const id=req.params.id;
        const updatateUser=req.body;
        const filter={_id: ObjectId(id)};
        const options={upsert:true}
        const updateDoc={
          $set:{
            name:updatateUser.name,
            email:updatateUser.email
          },
        };
        const result=await usersCollection.updateOne(filter,updateDoc,options)
        res.json(result);


      })

      // delete Api
      app.delete('/users/:id',async(req,res)=>{
        const id=req.params.id;
        const qurey={_id:ObjectId(id)};
        const result =await usersCollection.deleteOne(qurey);
        console.log('deletein an user',result);
        res.json(result);

      })
    } finally {
      // await client.close();
    }
  }
  run().catch(console.dir);
app.get('/',(req,res)=>{
    res.send('start my server')
});
app.listen(port,()=>{
    console.log('Running my server on port 5000',port)
});

//DTWq9uCTCU0NBue0//fatehAhmod
// try {
//   await client.connect();
//   const database = client.db("foodB");
//   const usersCollection = database.collection("haiku");
//   // create a document to insert
//   const doc = {
//     name: "tum",
//     email: "gsa@gmail.com",
    
//   }
//   const result =await usersCollection.insertOne(doc);
