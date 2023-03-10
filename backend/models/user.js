const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    image: {
        image_id: { type: String, required: true },
        secure_url: { type: String, required: true }
    },
    likedReviews: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Review' }],
    dislikedReviews: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Review' }],
    reviews: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Review' }]
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);