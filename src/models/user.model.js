import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userModel = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        maxLength: 255,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/.+@.+\..+/, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false
    },
    avatar_url: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        enum: ["user", "admin", "developer"],
        default: "user"
    },
    isActive: {
        type: Boolean,
        default: true
    },
    emailVerifiedAt: {
        type: String,
        default: null
    }
}, {timestamps: true});

userModel.pre("save", async function (next) {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

userModel.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

userModel.methods.isEmailVerified = function () {
    return !!this.emailVerifiedAt;
}

export default mongoose.model("User", userModel);