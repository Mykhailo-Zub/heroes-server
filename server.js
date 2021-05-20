const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const appPort = 4004;
const mongoUrl =
  "mongodb+srv://admin:Admin12345@cluster0.sbdt1.mongodb.net/heroes-server?retryWrites=true&w=majority";

const app = express();
app.use(bodyParser.json());
app.use(cors());

const corsOptions = {
  origin: "http://localhost:3000",
  optionSuccessStatus: 200,
};

//Model
const HeroesSchema = new mongoose.Schema({
  nickname: String,
  real_name: String,
  origin_description: String,
  superpowers: String,
  catch_phrase: String,
  images: Array,
});

// mongoose.model("Heroes", HeroesSchema);

const Heroes = mongoose.model("Heroes", HeroesSchema);

//Controller

const getAll = (req, res) => {
  Heroes.find()
    .exec()
    .then((heroes) => res.json(heroes))
    .catch((err) => res.status(500).json(err));
};

const getOne = (req, res) => {
  Heroes.findOne({ _id: req.params.id })
    .exec()
    .then((hero) => res.json(hero))
    .catch((err) => res.status(500).json(err));
};

const create = (req, res) => {
  Heroes.create(req.body)
    .then((createHero) => res.json(createHero))
    .catch((err) => res.status(500).json(err));
};

const update = (req, res) => {
  Heroes.updateOne({ _id: req.params.id }, { $set: req.body })
    .exec()
    .then((hero) => res.json(hero))
    .catch((err) => res.status(500).json(err));
};

const remove = (req, res) => {
  Heroes.findOneAndRemove({ _id: req.params.id })
    .exec()
    .then(() => res.json({ success: true }))
    .catch((err) => res.status(500).json(err));
};

//Routs
app.get("/heroes", cors(corsOptions), getAll);
app.get("/heroes/:id", cors(corsOptions), getOne);
app.post("/heroes", cors(corsOptions), create);
app.put("/heroes/:id", cors(corsOptions), update);
app.delete("/heroes/:id", cors(corsOptions), remove);

mongoose.set("useFindAndModify", false);
mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(appPort, () => console.log(`Listening on port ${appPort} ...`))
  )
  .catch((err) => console.error(`Error connecting to mongo: ${mongoUrl}`, err));
