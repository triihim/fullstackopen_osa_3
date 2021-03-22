require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express();
const port = process.env.PORT;

morgan.token("body", (req, res) => req.body && req.method === "POST" ? JSON.stringify(req.body) : "-");

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));

app.get("/info", (req, res, next) => {
  Person.count({}).then(count => {
    res.write(`Phonebook has info for ${count} people\n`);
    res.write((new Date()).toString());
    res.end();
  }).catch(e => next(e));
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then(persons => res.json(persons));
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id).then(p => res.json(p)).catch(e => next(e));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id).then(_ => res.sendStatus(204)).catch(e => next(e));
});

app.post("/api/persons", (req, res, next) => {
  const { name, number } = req.body;
  const isValidName = () => name && name.length > 0;
  const isValidNumber = () => number && number.length > 0;
  // const isNameAlreadyAdded = () => persons.filter(p => p.name.toLowerCase() === name.toLowerCase()).length > 0;

  if (!isValidName()) {
    return res.status(400).json({ error: "Name must be specified" });
  } else if (!isValidNumber()) {
    return res.status(400).json({ error: "Number must be specified" });
  } else {
    const newPerson = new Person({
      name: name,
      number: number
    });
    newPerson.save().then(createdPerson => res.status(201).json(createdPerson)).catch(e => next(e));
  }
});

app.put("/api/persons/:id", (req, res, next) => {
  const updatedPerson = {
    name: req.body.name,
    number: req.body.number
  };

  Person.findByIdAndUpdate(req.params.id, updatedPerson, { new: true })
    .then(person => res.json(person))
    .catch(e => next(e));
});

app.use((req, res) => {
  res.status(404).send({ error: "Enpoint not found" });
});

app.use((error, req, res, next) => {
  console.error("ERROR", error);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "Invalid id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).send({ error: error.message });
  }

  next(error);
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
