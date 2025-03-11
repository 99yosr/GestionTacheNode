const express = require('express');
const http = require('http');

const cors = require('cors');  // Import cors
const User = require('./models/User');  // Ensure this is your User model
const app = express();

require('dotenv').config();
const mongoose = require('mongoose');
const taskRoutes = require('./controllers/TaskController'); // Ensure this is the correct path
const projectRoutes = require('./controllers/ProjectController');
const authRoutes = require('./controllers/AuthController');
const userRoutes = require('./controllers/UserController');
const corsOptions = {
  origin: "http://localhost:3000",  // The frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],  // Allowed methods for HTTP requests
  allowedHeaders: ["Content-Type", "Authorization"], // Add any headers your client may need
};
app.use(cors(corsOptions));
const PORT = process.env.PORT || 2002;
//const server = http.createServer(app);
const server = app.listen(PORT, () => {
  console.log("Server running on port 2001");
});

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",  
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('projectsFetched', (projects) => {
    console.log('Projects fetched:', projects);
    socket.emit('message', 'Projects have been fetched successfully')
});});



app.use(express.json());


app.use('/tasks', taskRoutes); 

app.use('/projects', projectRoutes);

app.use('/auth', authRoutes);

app.use('/profile', userRoutes); 


mongoose.connect(process.env.MONGO_URI).then(()=>{
  console.log('connecting to database');
  return () => {
    newSocket.on('connection'); // Remove the listener
  };
}).catch(err=>{console.log(err)})

app.get('/', (req,res)=>{
  res.send('gestion des taaches running');
})

//const PORT = process.env.PORT || 2002;

//app.listen(PORT, ()=>{
  //console.log(`task running on ${PORT}`);
//})

