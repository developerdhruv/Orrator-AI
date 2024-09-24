import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import multer from 'multer';
import Video from './Models/VideoModel.js';
import path from 'path';
import fs from 'fs';
import Report from './Models/ReportModel.js';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath); // Upload folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Save the file with original extension
    }
});

const upload = multer({ storage: storage });
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
{/*app.post('/api/v1/register', async (req, res) => {
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
*/}

// Upload Video
app.post('/api/v1/upload_video', upload.single('video'), async (req, res) => {
    try {
        // Store the video metadata along with file path in MongoDB
        const { username, video_name } = req.body;
        const video_path = req.file.path; // Local path where video is stored

        const newVideo = new Video({
            username,
            video_name,
            video_path
        });

        const savedVideo = await newVideo.save();

        // Send back the video URL or ID by which it can be accessed
        res.status(201).json({
            message: 'Video uploaded successfully',
            video_id: savedVideo._id,
            video_url: `http://localhost:${PORT}/videos/${savedVideo._id}`  // URL to access video
        });
    } catch (err) {
        console.log(err);
        res.status(400).send('Error uploading video');
    }
});

// Route to serve video files by ID
app.get('/api/v1/videos/:id', async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return res.status(404).send('Video not found');
        }

        // Stream the video file to the client
        const videoPath = video.video_path;
        res.sendFile(path.resolve(videoPath));  // Serve the video file
    } catch (err) {
        console.log(err);
        res.status(400).send('Error retrieving video');
    }
});

app.post('/api/v1/reportadd', async(req, res)=>{
    try{
        const report = new Report(req.body);
        await report.save();
        res.status(201).send(report);

    }catch(err){
        res.status(400).send(err);  
    }

});

app.get('/api/v1/reportget', async(req, res)=>{
    try{
        const report = await Report.find();
        res.status(200).send(report);
    }catch(err){
        res.status(400).send(err);
    }
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
