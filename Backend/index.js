import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import User from './Models/UserModel.js';
import multer from 'multer';
import VideoUpload from './Functions/Cloudinary.js';
import Video from './Models/VideoModel.js';

const upload = multer({ dest: 'uploads/' });
const app = express();
const PORT = 3740;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));

// MongoDB connection
const connectToDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/OratorAI', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to DB');
    } catch (err) {
        console.log('Error connecting to DB', err);
    }
};

connectToDB();

// Register User
app.post('/api/v1/register', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Login User
app.get('/api/v1/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).send('User not found');
        }
        if (user.password !== req.body.password && user.metamaskAddress !== req.body.metamaskAddress) { 
            return res.status(401).send('Invalid password');
        }
        res.status(200).send(user);
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});

// Upload Video
app.post('/api/v1/upload_video', upload.single('file'), async (req, res) => {
    try{
        const file = req.file.path;
        const result = await uploadVideo(file);
        res.status(201).send(result);
        const video = new Video({
            cloudinary_id: result.public_id,
            user_id: req.body.user_id,
            title: req.body.title,
        });

    }catch(err){
        console.log(err);
        res.status(400).send
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
