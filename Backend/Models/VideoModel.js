import mongoose from 'mongoose';
const { Schema } = mongoose;
const videoSchema = new mongoose.Schema({
    username: { type: String, required: true },
    video_name: { type: String, required: true },
    video_path: { type: String, required: true },  // Path to the uploaded video
});
const Video = mongoose.model('Video', videoSchema);
export default Video;