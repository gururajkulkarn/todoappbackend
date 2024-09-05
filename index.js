require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path'); // Import path
const UserModel = require('./models/Users');
const RegisterModel = require('./models/NewUser');
const TaskModel = require('./models/Task');
const ApplModel = require('./models/Application'); // Ensure this model is imported

const app = express();

// Configure CORS
app.use(cors({
  origin: 'http://localhost:3000', // Update to your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGO_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', (error) => {
  console.error('Database connection error:', error);
});

db.once('open', () => {
  console.log('Database connected');
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory where files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

const upload = multer({ storage: storage });

// Routes
app.get('/', (req, res) => {
  TaskModel.find({})
    .then(tasks => res.json(tasks))
    .catch(err => res.status(500).json({ error: err.message }));
});

app.post('/createTask', upload.single('file'), async (req, res) => {
  try {
    const { mname, title, descri, deadline } = req.body;
    const filePath = req.file ? req.file.path : '';

    const newTask = new TaskModel({
      mname,
      title,
      descri,
      deadline,
      filePath
    });

    await newTask.save();
    res.status(201).json({ message: 'Task created successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create task.', error: error.message });
  }
});

app.get('/getTask/:id', (req, res) => {
  const id = req.params.id;
  TaskModel.findById(id)
    .then(task => res.json(task))
    .catch(err => res.status(500).json({ error: err.message }));
});

app.put('/updateTask/:id', (req, res) => {
  const id = req.params.id;
  TaskModel.findByIdAndUpdate(id, req.body, { new: true })
    .then(task => res.json(task))
    .catch(err => res.status(500).json({ error: err.message }));
});

app.delete('/deleteTask/:id', (req, res) => {
  const id = req.params.id;
  TaskModel.findByIdAndDelete(id)
    .then(result => res.json(result))
    .catch(err => res.status(500).json({ error: err.message }));
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  RegisterModel.findOne({ email })
    .then(user => {
      if (user) {
        if (user.password === password) {
          res.json("Success");
        } else {
          res.json("The password is incorrect");
        }
      } else {
        res.json("No records found");
      }
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

app.post('/createRegister', (req, res) => {
  RegisterModel.create(req.body)
    .then(registers => res.json(registers))
    .catch(err => res.status(500).json({ error: err.message }));
});

app.post('/application', (req, res) => {
  ApplModel.create(req.body)
    .then(forms => res.json(forms))
    .catch(err => res.status(500).json({ error: err.message }));
});

app.get('/list', (req, res) => {
  ApplModel.find({})
    .then(forms => res.json(forms))
    .catch(err => res.status(500).json({ error: err.message }));
});

app.get('/getcandidate/:id', (req, res) => {
  const id = req.params.id;
  ApplModel.findById(id)
    .then(forms => res.json(forms))
    .catch(err => res.status(500).json({ error: err.message }));
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
