const fs = require("fs");
const express = require("express");
const app = express();

// json middleware to fetch req.body while creating new tour
app.use(express.json());

// Get the tours from json file
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/api-data/data/tours-simple.json`)
);

// Get all tours
const getAllTours = (req, res) => {
    res.status(200).json({
        status: "success",
        total_tours: tours.length,
        tours,
    });
};

// Get tour by id
const getTourById = (req, res) => {
    console.log(req.params);
    const id = req.params.id * 1;
    const tour = tours.find((el) => el.id === id);
    if (!tour) {
        return res.status(404).json({
            status: "failed",
            message: `No tour found for matching id ${id}`,
        });
    }
    res.status(200).json({
        status: "success",
        total_tours: 1,
        tour,
    });
};

// Create Tour
const createTour = (req, res) => {
    const newID = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newID }, req.body);
    tours.push(newTour);
    fs.writeFile(
        `${__dirname}/api-data/data/tours-simple.json`,
        JSON.stringify(tours),
        (err) => {
            res.status(201).json({
                status: "success",
                tour: newTour,
            });
        }
    );
};

// Update Tour
const updateTour = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find((el) => el.id === id);
    if (!tour) {
        return res.status(404).json({
            status: "failed",
            message: `No tour found for the id ${id}`,
        });
    }
    res.status(200).json({
        status: "success",
    });
};

// Delete Tour
const deleteTour = (req, res) => {
    res.status(204).json({
        status: "success",
    });
};

// Get all users
const getAllUsers = (req, res) => {
    res.status(500).json({
        status: "Internal Server Error",
        message: "Route not Exists",
    });
};
// create New User
const createUser = (req, res) => {
    res.status(500).json({
        status: "Internal Server Error",
        message: "Route not Exists",
    });
};
// Fetch user by Id
const getUserByID = (req, res) => {
    res.status(500).json({
        status: "Internal Server Error",
        message: "Route not Exists",
    });
};
// User User
const updateUser = (req, res) => {
    res.status(500).json({
        status: "Internal Server Error",
        message: "Route not Exists",
    });
};
// Delete User
const deleteUser = (req, res) => {
    res.status(500).json({
        status: "Internal Server Error",
        message: "Route not Exists",
    });
};
// app.get("/api/v1/tours", getAllTours);
// app.get("/api/v1/tours/:id", getTourById);
// app.post("/api/v1/tours", createTour);
// app.patch("/api/v1/tours/:id", updateTour);
// app.delete("/api/v1/tours/:id", deleteTour);

// tours routes
app.route("/api/v1/tours").get(getAllTours).post(createTour);
app.route("/api/v1/tours/:id")
    .get(getTourById)
    .patch(updateTour)
    .delete(deleteTour);

// Users Routes
app.route("/api/v1/users").get(getAllUsers).post(createUser);
app.route("/api/v1/users/:id")
    .get(getUserByID)
    .patch(updateUser)
    .delete(deleteUser);

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server started at http://127.0.0.1:${port}`);
});
