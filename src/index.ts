import * as express from 'express';
import mongoose from 'mongoose';
let app:express.Application =  express(); //constructor is called(express());
app.listen(5000,() =>{
    console.log("server is running at port 5000");
}); // listens the server with port no: 5000

app.get('/login',(req:any,res,next) =>{
    console.log("middleware",req.query);
    res.send({msg:"Successfully done"})
})

const MONGO_URI: string = 'mongodb+srv://kishori:Kish1998@cluster0.o07oh.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(MONGO_URI).then(() => {
    console.log('connected to database');
}).catch(err => {
    console.log('error hai', err);
});

//CONSOLE OUTPUT :
//server is running at port 5000
//connected to database