// User Model - Mongoose schema for users
// Fields: name, email, password (hashed), createdAt
// TODO: Add pre-save hook for password hashing, comparePassword method

import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,

    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false
    }
}, {
    timestamps: true
})
//This runs before saving a user.
userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next(); //This prevents hashing again when user updates name/email.

    try{
        const salt = await bcrypt.genSalt(12);
        this.password =  await bcrypt.hash(this.password,salt); 
        next();
    }
    catch(error){
        next(error);
    }

})

userSchema.methods.comparePassword = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password)
};

const User = mongoose.model('User', userSchema);
export default User;

/*example json {
  "_id": "user123",
  "name": "Saurav",
  "email": "saurav@gmail.com",
  "password": "$2a$12$hashedPassword...",
  "createdAt": "...",
  "updatedAt": "..."
}*/