// Application Model - Mongoose schema for job applications
// Fields: user, company, role, status, jobUrl, salary, location, type, source, appliedDate, resumePath, order
import mongoose from "mongoose";

const Schema = mongoose.Schema;


const applicationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    company: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['wishlist', 'applied', 'phone_screen', 'interview', 'offer', 'rejected'],
        default: 'wishlist'
    },
    jobUrl: {
        type: String,
        trim: true
    },
    salary: {
        min: Number,
        max: Number,
        currency: {
            type: String,
            default: 'INR'
        }
    },
    location: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        enum: ['remote', 'onsite', 'hybrid']
    },
    source: {
        type: String,
        enum: ['linkedin', 'naukri', 'indeed', 'company_website', 'referral', 'other']
    },
    appliedDate: {
        type: Date
    },
    resumePath: {
        type: String
    },
    order: {
        type: Number,
        default: 0
    }
}, { 
    timestamps: true 
});

// Adding requested indexes
applicationSchema.index({ user: 1, status: 1 });
applicationSchema.index({ user: 1, createdAt: -1 });

const Application = mongoose.model('Application', applicationSchema);

export default Application;