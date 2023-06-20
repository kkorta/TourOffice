import express from "express";
import jwt from 'jsonwebtoken';
import {ToursModel} from "./schemas/tours";
import {UsersModel} from "./schemas/users";
import {OrdersModel} from "./schemas/orders";
import {initMongoConnection} from "./mongo-connection";
import cors from 'cors';
import {authAdmin} from "./auth/admin-auth";
import {Roles} from "./enums/roles";
import {authClient} from "./auth/client-auth";
import {ReviewsModel} from "./schemas/reviews";

const app = express()

app.use(express.json());
app.use(cors({origin:'http://localhost:4200'}))
const moment = require("moment");

const port = 8080;

// add new tour

app.post( "/tours",async  ( req, res ) => {

    try{
        const tourInstance =  new ToursModel(req.body)
        await tourInstance.save()
        res.status(201).send({message: "Added Tour"})

    }catch (err){
        res.status(500).send({message: "Internal server error"})
    }

} );

// add new user

app.post( "/register",async  ( req, res ) => {

    const userData =  req.body

    try{
        const user = await UsersModel.findOne({email: userData.email})

        if(user){
            res.status(400).send({message: "Email already exists"})
            return
        }

        const userInstance =  new UsersModel(req.body)
        await userInstance.save()
        let payload = {subject: userInstance._id}
        let token = jwt.sign(payload, 'secretKey', {expiresIn: "30min"})
        res.status(200).send({token, email: userInstance.email, role: userInstance.role,
            blocked: userInstance.blocked, _id: userInstance._id})

    }catch (err){
        res.status(500).send({message: "Internal server error"})
    }

});



// log in user

app.post( "/login",async  ( req, res ) => {

    const userData =  req.body

    try{
        const user = await UsersModel.findOne({email: userData.email})
        if(!user){
            res.status(400).send({message: "Wrong email or password"})
            return
        }
        if(user.password !== userData.password){
            res.status(400).send({message: "Wrong email or password"})
            return
        }
        let payload = {subject: user._id}
        let token = jwt.sign(payload, 'secretKey', {expiresIn: "30min"})
        res.status(200).send({token, email: user.email, role: user.role, blocked: user.blocked, _id: user._id})

    }catch (err){
        res.status(500).send({message: "Internal server error"})
    }

});

// add order (only client)

app.post( "/orders", authClient, async  ( req, res ) => {

    const data =  req.body

    try{
        const user = await UsersModel.findOne({email: data.email})
        if(!user){
            res.status(400).send({message: "User does not exist"})
            return
        }
        const tour = await ToursModel.findOne({_id: data.tourId})
        if(!tour){
            res.status(400).send({message: "Tour does not exist"})
            return
        }

        const updatedTour = await ToursModel.findByIdAndUpdate(
            tour._id,
            { $inc: { limit: -data.amount } },
            { new: true }
        );

        const orderInstance =  new OrdersModel({userId: user._id, tourId: tour._id, amount: data.amount, date: data.date})
        await orderInstance.save()
        res.status(200).send()

    }catch (err){
        res.status(500).send({message: "Internal server error"})
    }

});


// add review (only client)

app.post( "/reviews", authClient, async  ( req, res ) => {

    const data =  req.body

    try{
        const user = await UsersModel.findOne({_id: data.userId})
        if(!user){
            res.status(400).send({message: "User does not exist"})
            return
        }
        const tour = await ToursModel.findOne({_id: data.tourId})
        if(!tour){
            res.status(400).send({message: "Tour does not exist"})
            return
        }

        const reviewInstance =  new ReviewsModel({userId: data.userId, nickname: data.nickname,
            tourId: data.tourId, description: data.description, date: data.date})

        await reviewInstance.save()
        res.status(200).send()

    }catch (err:any){
        res.status(500).send({message: "Internal server error"})
    }

});


// get orders

app.get("/orders/:userId", async  ( req, res ) => {

    try{
        const user = await UsersModel.findOne({_id: req.params.userId})

        if(!user){
            res.status(400).send({message: "No such user!"})
            return
        }

        const orders = await OrdersModel.find({userId: user._id})
        res.status(200).send(orders);

    }catch (err){
        res.status(500).send({message: "Internal server error"})
    }

});

// get reviews of a particular tour

app.get("/reviews/:tourId", async  ( req, res ) => {

    try{

        const tour = await ToursModel.findOne({_id: req.params.tourId})

        if(!tour){
            res.status(400).send({message: "No such tour!"})
            return
        }

        const reviews = await ReviewsModel.find({tourId: tour._id})

        const modifiedReviews = reviews.map((review) => ({
            description: review.description,
            date: review.date,
            nickname: review.nickname,
        }));

        res.status(200).send(modifiedReviews);

    }catch (err){
        res.status(500).send({message: "Internal server error"})
    }

});

// get tours

app.get("/tours", async (req, res) => {

    const currentDate = moment().toDate();

    try {
        const tours = await ToursModel.find();

        res.send(tours);
    } catch (err) {
        res.status(500).send({ message: "Internal server error" });
    }
});



app.listen( port, async () => {
    await initMongoConnection()
    console.log( `server started at http://localhost:${port}` );
} );



