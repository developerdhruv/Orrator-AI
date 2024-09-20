import mongoose from 'mongoose';
const { Schema } = mongoose;
const VideoSchema= new Schema({
    cloudinary_id: { type: String, required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now },
    title: { type: String, required: true },
})
const Video = mongoose.model('Video', VideoSchema);
export default Video;