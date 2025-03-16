import express, { json } from "express";
import cors from "cors";

const app = express();
const allowedOrigins = [
    "https://m-nowfal.github.io",  // Correct frontend URL
    "http://localhost:5173" // (Optional) Allow local testing
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true // If sending cookies or auth headers
}));
app.use(json());

let users = [];
let toDos = [];

app.post('/add-to-do', (req, res, next) => {
    const { id, time, task, completed, user } = req.body.item;
    if (toDos.length > 0) {
        toDos[users.indexOf(user)].push({ id, time, task, completed });
    } else {
        toDos.push([{ id, time, task, completed }]);
    }
    res.status(200).json({ toDos: req.body.item });
});

app.get('/get-to-do/:user', (req, res, next) => {
    const { user } = req.params;
    res.status(200).json({ toDos: toDos[users.indexOf(user)] });
});

app.delete('/del-to-do/:id/:user', (req, res, next) => {
    const { id, user } = req.params;
    toDos[users.indexOf(user)] = toDos[users.indexOf(user)].filter(toDo => toDo.id != id);
    res.status(200).json({ toDos: toDos[users.indexOf(user)] });
});

app.post('/create-to-do-user/:user', (req, res, next) => {
    const { user } = req.params;
    const exist = users.find(u => u == user);
    if (!exist) {
        users.push(user);
        res.status(200).json({ success: true });
    } else {
        res.status(201).json({ success: false });
    }
});

app.put('/toggle-to-do/:id/:userName', (req, res, next) => {
    const { id, userName } = req.params;
    toDos[users.indexOf(userName)] = toDos[users.indexOf(userName)].map(task => (
        task.id == id ? { ...task, completed: !task.completed } : task
    ));
    res.status(200).json({ success: true });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log("Listening to Port " + PORT);
});