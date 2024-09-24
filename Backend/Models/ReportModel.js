import mongoose from 'mongoose';
const { Schema } = mongoose;
const ReportSchema = new Schema({
    videoId: { type: String, required: true },
    report: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    

});

const Report = mongoose.model('Report', ReportSchema);
export default Report;