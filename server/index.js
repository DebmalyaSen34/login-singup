import e from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import session from 'express-session';
import userModel from './models/userData.js'; // Importing user model
import Text from './models/textSchema.js'; // Importing text model
import MongoStore from 'connect-mongo'; // For storing session in MongoDB
import cors from 'cors';
import crypto from 'crypto'; // For generating secure random session secrets
dotenv.config(); // Loading environment variables from .env file

const app = e(); //* Creating an Express application
app.use(e.json()); //* Middleware to parse JSON bodies
// To communicate with my frontend react application
app.use(cors({
    origin: 'http://localhost:5173', //* Frontend application URL
    credentials: true //* Allowing credentials (cookies, authorization headers, etc.)
}));

const dbUrl = process.env.DB_URL; //* MongoDB connection URL
const port = process.env.PORT; // Server port

const secret = crypto.randomBytes(64).toString('hex'); // Generating a secure secret for sessions
//* Session configuration
app.use(session({
    name: process.env.SESS_NAME, // Name of the session cookie
    secret: secret, //* Secret used to sign the session ID cookie
    resave: false, //* Avoid resaving sessions that haven't changed
    saveUninitialized: false, // Don't save uninitialized sessions
    store: MongoStore.create({mongoUrl: dbUrl}), // Storing sessions in MongoDB
    cookie: {
        sameSite: 'strict',
        httpOnly: true, //* Cookie not accessible via JavaScript
        secure: process.env.NODE_ENV === 'production', //* Use secure cookies in production
        maxAge: 7200000 // Cookie expiration time in milliseconds
    }
}))

mongoose.connect(dbUrl);

// Checks whether the user is logged in so
// that appropriate pages are loaded
app.get('/auth/status', (req, res) => {
    if(req.session.userId){
        res.json({isLoggedIn: true});
    }else{
        res.json({isLoggedIn: false});
    }
});

// Registers the user to the mongoDB database
// and then logs them in
app.post('/register', async(req, res) => {
    // Hashing is used to protect the password from any security breaches
    const hashedPassword = await bcrypt.hash(req.body.password, 10); //TODO: use more complicated method of password protection in future
    // Adding the user to the predefined user Schema
    const user = new userModel({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    });
    user.save()
    .then(user => {
        if(!req.session.userId){
            //* to store the data with same id as that of the user
            req.session.userId = user._id;
        }
        req.session.save(err => {
            if(err){
                //TODO: Use better error handling methods
                console.log(err);
            }else{
                res.json({redirect: 'http://localhost:5173/home'});
            }
        })
    })
    .catch(err => res.json(err)); //TODOD: Use better error handling methods
});

// Logs the user in the database
app.post('/login', async (req, res) => {
    const user = await userModel.findOne({username: req.body.username});
    if(user && bcrypt.compare(req.body.password, user.password)){ //! removed await
        req.session.userId = user._id;
        req.session.save(err => {
            if(err){
                console.log(err);
            }else{
                res.json({redirect: 'http://localhost:5173/home'});
            }
        })
    }else{
        res.status(401).json({message: 'Invalid email or password'});
    }
});

// Stores the user's text data in the database
app.post('/userText', async(req, res)=>{
    if(!req.session.userId){
        return res.status(403).json({message: 'No session user ID found'});
    }
    // Finding the user based on the session.userId
    const user = await userModel.findById(req.session.userId).exec();
    // Adding the data to the database with userId as a parameter so that
    // each data can be retrieved by that user only
    const text = new Text({
        userId: req.session.userId,
        author: user.username,
        title: req.body.title,
        content: req.body.content
    });
    text.save()
    .then(text => res.json(text))
    .catch(err => res.json(err));
});

// Getting the texts sent by the user stored in the database
app.get('/texts', async(req, res)=>{
    try{
        const userTexts = await Text.find({userId: req.session.userId});
        res.json(userTexts);
    }catch(err){
        console.log(err);
        res.status(500).json({message: 'An error occured while fetching data'});
    }
});

// Logging the user out and destroy the cookie and session
app.post('/logout', async (req, res) => {
    try {

        const sessionCollection = mongoose.connection.collection('sessions');
        // Deleting only that specific session created for the user
        const result = await sessionCollection.deleteOne({_id: req.sessionID});
        if(result.deletedCount===0){
            console.log('No session found with the provided sessionID!');
            return res.status(404).json({message: 'Session not found'});
        }
        //* Session destruction
        req.session.destroy(err => {
            if (err) {
                console.log(err);
                res.status(500).json({message: 'Could not log you out. Please try again!'});
            } else {
                res.clearCookie(process.env.SESS_NAME); //* Clearing cookie to ensure complete logout
                console.log('successfully logged out!');
                // After logging out the website will redirect back to the login page
                res.json({redirect: 'http://localhost:5173/login'});
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'An error occurred while clearing sessions'});
    }
})

app.listen(port, () => {
    console.log(`Server running at ${port}`);
});