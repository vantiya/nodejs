const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");
const bcrypt = require("bcryptjs");

// name, email, photo, password, confirm password

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail],
        trim: true,
    },
    photo: String,
    password: {
        type: String,
        required: [true, "Provide a password"],
        minlength: [8, "Password Should be minimum 8 Character Long"],
        select: false,
    },
    confirmPassword: {
        type: String,
        required: [true, "Please confirm password"],
        validate: {
            // For New User Only - create(), save()
            validator: function (el) {
                return el === this.password;
            },
            message: "Provide same password for confirm Password!",
        },
    },
    passwordChangedAt: Date,
});

userSchema.pre("save", async function (next) {
    // Only run if password was modified
    if (!this.isModified("password")) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete Confirm Password
    this.confirmPassword = undefined;
    next();
});

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWTTimeStamp) {
    if (this.passwordChangedAt) {
        // if changed
        const changedTimeStamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );

        return JWTTimeStamp < changedTimeStamp; // like 100 < 200 then changed
    }
    // not changed
    return false;
};

module.exports = User = mongoose.model("Users", userSchema);
