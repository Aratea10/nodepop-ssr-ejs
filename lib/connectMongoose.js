const mongoose = require('mongoose');
const uri = process_params.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nodepop';
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});
mongoose.connection.once('open',() => {
    console.log('Connected to MongoDB');
});
async function connect() {
    if (mongoose.connection.readyState === 1) return mongoose.connection;
    return mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
    });
}
module.exports = { connect };