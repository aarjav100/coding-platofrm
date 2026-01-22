const mongoose = require('mongoose');

const submissionSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    problem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
        required: true
    },
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    status: {
        type: String, // 'Accepted', 'Wrong Answer', 'Time Limit Exceeded', etc.
        required: true
    },
    executionTime: {
        type: Number // in ms
    },
    memoryUsed: {
        type: Number // in KB
    }
}, {
    timestamps: true
});

const Submission = mongoose.model('Submission', submissionSchema);
module.exports = Submission;
