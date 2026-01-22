const mongoose = require('mongoose');

const problemSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true
    },
    constraints: {
        type: String
    },
    inputFormat: {
        type: String
    },
    outputFormat: {
        type: String
    },
    testCases: [{
        input: {
            type: String,
            required: true
        },
        output: {
            type: String,
            required: true
        },
        isPublic: {
            type: Boolean,
            default: false
        }
    }],
    template: {
        type: String // Starter code
    }
}, {
    timestamps: true
});

const Problem = mongoose.model('Problem', problemSchema);
module.exports = Problem;
