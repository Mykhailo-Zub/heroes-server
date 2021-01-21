const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const appPort = 4004;
const mongoUrl =
  "mongodb+srv://admin:admin12345@cluster0.sbdt1.mongodb.net/heroes-server?retryWrites=true&w=majority";

const app = express();
app.use(bodyParser.json());

//Model
const HeroesSchema = new mongoose.Schema({
  nickname: String,
  real_name: String,
  origin_description: String,
  superpowers: String,
  catch_phrase: String,
  images: Array,
});

mongoose.model("Heroes", HeroesSchema);

const Heroes = mongoose.model("Heroes");

//Controller

const getAll = (req, res) => {
  Heroes.find()
    .exec()
    .then((heroes) => res.json(heroes))
    .catch((err) => res.status(500).json(err));
};

const create = (req, res) => {
  Heroes.create()
    .then((createHero) => res.json(createHero))
    .catch((err) => res.status(500).json(err));
};

const update = (req, res) => {
  Heroes.updateOne({ _id: req.params.id }, { $set: req.body })
    .exec()
    .then((hero) => req.json(hero))
    .catch((err) => res.status(500).json(err));
};

const remove = (req, res) => {
  Heroes.deleteOne({ id: req.params.id })
    .exec()
    .then(() => res.json({ success: true }))
    .catch((err) => res.status(500).json(err));
};

//Routs
app.get("/heroes", getAll);
app.post("/heroes", create);
app.put("/heroes/:id", update);
app.delete("/heroes/:id", remove);

mongoose.set("useFindAndModify", false);
mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(appPort, () => console.log(`Listening on port ${appPort} ...`))
  )
  .catch((err) => console.error(`Error connecting to mongo: ${mongoUrl}`, err));
