const express = require('express');
const app = express();
app.use(express.json());

require('dotenv').config();
const mongoose = require('mongoose');
const taskRoutes = require('./controllers/TaskController'); // Ensure this is the correct path
const projectRoutes = require('./controllers/ProjectController');



app.use('/tasks', taskRoutes); 

app.use('/projects', projectRoutes);


mongoose.connect(process.env.MONGO_URI).then(()=>{
  console.log('connecting to database');
}).catch(err=>{console.log(err)})

app.get('/', (req,res)=>{
  res.send('gestion des taaches running');
})

const PORT = process.env.PORT || 2002;

app.listen(PORT, ()=>{
  console.log(`task running on ${PORT}`);
})