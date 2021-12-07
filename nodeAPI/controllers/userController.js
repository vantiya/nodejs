const fs = require("fs");
const multer = require("multer");
const User = require("./../modals/users");
const catchAsync = require("./../utils/catchAsync");
const ApiError = require("./../utils/apiError");
const factory = require("./../controllers/handlerFactory");

const users = JSON.parse(
    fs.readFileSync(`${__dirname}/../api-data/data/users.json`)
);

// Check if user exists
exports.isUserIdExists = (req, res, next, val) => {
    const userID = val;
    const user = users.find((el) => el._id === userID);
    if (!user) {
        return res.status(404).json({
            status: "Failed",
            message: `User not found for the id ${userID}`,
        });
    }
    next();
};

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(file.originalname);
        cb(null, "public/img/users");
    },
    filename: (req, file, cb) => {
        // console.log(file);
        const ext = file.mimetype.split("/")[1];
        cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
    },
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb(
            new ApiError("Not an image! Please upload only images.", 400),
            false
        );
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("photo");

exports.updateMyData = catchAsync(async (req, res, next) => {
    // console.log(req.file);
    // console.log(req);
    // create error if POST is for update password
    if (req.body.password || req.body.confirmPassword) {
        return next(
            new ApiError(
                "The route isn't for password. Please use /updateMyPassword to udpate password.",
                400
            )
        );
    }

    // Update User record
    const filteredBody = filterObj(req.body, "name", "email");
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        filteredBody,
        {
            new: true,
            runValidators: true,
        }
    );
    res.status(200).json({
        status: "Success",
        data: {
            user: updatedUser,
        },
    });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: "Success",
        message: "User deleted successfully!",
    });
});

// Get all users
exports.getAllUsers = factory.getAll(User);
// create New User
exports.createUser = factory.creatOne(User);
// Fetch user by Id
exports.getUserByID = factory.getOne(User);
// Update User
exports.updateUser = factory.updateOne(User);
// Delete User
exports.deleteUser = factory.deleteOne(User);
