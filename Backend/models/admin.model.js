import mongoose  from "mongoose";
const admin = new mongoose.Schema({
    name: {
        default: "",
        type: String,
    },
    email: {
        required: true,
        type: String,
    },
    password: {
        required: true,
        type: String,
    },
    phone_number: {
        default: "",
        type: String,
    },
    image: {
        default: "",
        type: String,
    }
});

const adminModel = mongoose.model('admin', admin);
export { adminModel as admin };