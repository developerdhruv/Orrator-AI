import { v2 as cloudinary } from 'cloudinary';
//configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


async function uploadVideo(file) {
    try {
        const result = await cloudinary.uploader.upload(file, {
            resource_type: 'video',
            public_id: 'video',
        });
        return result;
    } catch (err) {
        console.log(err);
    }
}

export default uploadVideo;