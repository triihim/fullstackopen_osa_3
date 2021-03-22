const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3001;

morgan.token("body", (req, res) => req.body && req.method === "POST" ? JSON.stringify(req.body) : "-");

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));

const persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "040-123456"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

app.get("/info", (req, res) => {
    res.write(`Phonebook has info for ${persons.length} people\n`);
    res.write((new Date()).toString());
    res.end();
});

app.get("/api/persons", (req, res) => {
    res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
    const person = persons.find(p => p.id === +req.params.id);
    if(person) {
        res.json(person);
    } else {
        res.status(404).json({ error: `No person found with id: ${req.params.id}` });
    }
});

app.delete("/api/persons/:id", (req, res) => {
    const index = persons.map(p => p.id).indexOf(+req.params.id);
    if(index > -1) {
        persons.splice(index, 1);
        res.sendStatus(204);
    } else {
        res.status(404).json({ error: `No person found with id: ${req.params.id}` });
    }
});

app.post("/api/persons", (req, res) => {
    const {name, number} = req.body;
    const isValidName = () => name && name.length > 0;
    const isValidNumber = () => number && number.length > 0;
    const isNameAlreadyAdded = () => persons.filter(p => p.name.toLowerCase() === name.toLowerCase()).length > 0;
    const generateId = () => Math.floor(Math.random() * 1000);

    if(isNameAlreadyAdded()) {
        return res.status(400).json({ error: "Person already added" });
    } else if(!isValidName()) {
        return res.status(400).json({ error: "Name must be specified" });
    } else if(!isValidNumber()) {
        return res.status(400).json({ error: "Number must be specified" });
    } else {
        const newPerson = {
            id: generateId(),
            name: name,
            number: number
        };
        persons.push(newPerson);
        res.status(201).json(newPerson);
    }
});

app.listen(port, () => console.log(`Server listening on port ${port}`));