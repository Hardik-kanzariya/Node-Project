const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");
const Movie = require("../model/movie-model");

router.get("/", movieController.getMovies);
router.post("/add-movie", Movie.uploadImage, movieController.addMovie);
router.get("/delete-movie/:id", movieController.deleteMovie);
router.get("/edit-movie/:id", movieController.editMovie);
router.post("/update-movie/:id", Movie.uploadImage, movieController.updateMovie);

module.exports = router;
