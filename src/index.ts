import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

const app = express();
const prisma = new PrismaClient();

 app.use(cors({
    origin: 'http://localhost:3000', // Only allow requests from the frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type'], // Allowed headers
}));
app.use(express.json());

app.get('/tasks', async (req, res) => {
    try {
        const tasks = await prisma.task.findMany({
            select: {
                id: true,
                title: true,
                color: true,
                completed: true,
            },
        });
        res.json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
});


app.post('/tasks', async (req, res) => {
    const { title, color, completed } = req.body;

    console.log("Incoming task data:", { title, color, completed }); // Add this line

    try {
        const newTask = await prisma.task.create({
            data: {
                title,
                color,
                completed,
            },
        });
        res.status(201).json(newTask);
    } catch (error) {
        console.error("Error adding task:", error); // Log any errors
        res.status(500).json({ error: "Failed to add task" });
    }
});

app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { title, color, completed } = req.body; // Updateable fields

    try {
        const updatedTask = await prisma.task.update({
            where: { id: parseInt(id) },
            data: {
                ...(title && { title }),
                ...(color && { color }),
                ...(completed !== undefined && { completed }), // Ensure `completed` is a boolean
            },
        });
        res.json(updatedTask);
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ error: "Failed to update task" });
    }
});


// Delete a task
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.task.delete({
    where: { id: parseInt(id) },
  });
  res.json({ message: 'Task deleted successfully' });
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
