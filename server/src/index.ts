const path = require("path"); // Add the 'path' module
const express = require("express");
const app = express();
const cors = require("cors");

const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();

const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();

app.use(cors());

app.use(express.json());

app.get("/api/projects", async (req: any, res: any) => {
  try {
    async function main() {
      const data = await prisma.project.findMany();
      res.json(data);
    }

    main()
      .then(async () => {
        await prisma.$disconnect();
      })
      .catch(async (e: any) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
      });
  } catch (error) {
    console.error("Error fetching data:", error);

    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/tasks", async (req: any, res: any) => {
  try {
    async function main() {
      const { projectIds } = req.query;

      const projectIdArray = projectIds.split(",").map(Number);

      const data = await prisma.task.findMany({
        where: {
          project_id: {
            in: projectIdArray,
          },
        },
        include: {
          project: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      res.json(data);
    }

    main()
      .then(async () => {
        await prisma.$disconnect();
      })
      .catch(async (e: any) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
      });
  } catch (error) {
    console.error("Error fetching data:", error);

    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/notes/:id", async (req: any, res: any) => {
  try {
    async function main() {
      const taskId: number = parseInt(req.params.id);
      console.log(taskId);

      const data = await prisma.notes.findMany({
        where: { task_id: taskId },
      });
      res.json(data);
    }

    main()
      .then(async () => {
        await prisma.$disconnect();
      })
      .catch(async (e: any) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
      });
  } catch (error) {
    console.error("Error fetching data:", error);

    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/addproject", async (req: any, res: any) => {
  const formData = req.body;

  console.log("Received form data:", formData);

  if (formData === undefined) {
    console.log("received req.body is undefined");
  }

  try {
    async function main() {
      const newProject = await prisma.project.create({
        data: {
          name: formData.name,
        },
      });
      console.log("New project created:", newProject);
      res.status(200).json({ message: "Form data received successfully!" });
    }

    main()
      .then(async () => {
        await prisma.$disconnect();
      })
      .catch(async (e: any) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
      });
  } catch (error) {
    console.error("Error creating project:", error);
  }
});

app.post("/api/addtask", async (req: any, res: any) => {
  const formData = req.body;

  console.log("Received form data:", formData);

  if (formData === undefined) {
    console.log("received req.body is undefined");
  }
  //name, priority, start_date_time, due_date_time, recurring, project_id
  try {
    async function main() {
      const isoStartDate = new Date(formData.start_date_time).toISOString();
      const isoDueDate = new Date(formData.due_date_time).toISOString();

      const newTask = await prisma.task.create({
        data: {
          name: formData.name,
          priority: formData.priority,
          start_date_time: isoStartDate,
          due_date_time: isoDueDate,
          recurring: formData.recurring,
          project_id: formData.project,
        },
      });
      console.log("New task created:", newTask);
      res.status(200).json({ message: "Form data received successfully!" });
    }

    main()
      .then(async () => {
        await prisma.$disconnect();
      })
      .catch(async (e: any) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
      });
  } catch (error) {
    console.error("Error creating project:", error);
  }
});

app.post("/api/addnote", async (req: any, res: any) => {
  const formData = req.body;

  console.log("Received form data:", formData);

  if (formData === undefined) {
    console.log("received req.body is undefined");
  }
  try {
    async function main() {
      const newNote = await prisma.notes.create({
        data: {
          task_id: formData.task_id,
          message: formData.message,
        },
      });
      console.log("New note created:", newNote);
      res.status(200).json({ message: "Form data received successfully!" });
    }

    main()
      .then(async () => {
        await prisma.$disconnect();
      })
      .catch(async (e: any) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
      });
  } catch (error) {
    console.error("Error creating project:", error);
  }
});

app.put("/api/edittask/:id", async (req: any, res: any) => {
  const taskId = parseInt(req.params.id);
  const formData = req.body;

  console.log("Received form data:", formData);

  if (formData === undefined) {
    console.log("received req.body is undefined");
  }
  //name, priority, start_date_time, due_date_time, recurring, project_id
  try {
    async function main() {
      const isoStartDate = new Date(formData.start_date_time).toISOString();
      const isoDueDate = new Date(formData.due_date_time).toISOString();

      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: {
          name: formData.name,
          priority: formData.priority,
          start_date_time: isoStartDate,
          due_date_time: isoDueDate,
          recurring: formData.recurring,
          project_id: formData.project,
        },
      });
      console.log("task updated:", updatedTask);
      res.status(200).json({ message: "Form data received successfully!" });
    }

    main()
      .then(async () => {
        await prisma.$disconnect();
      })
      .catch(async (e: any) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
      });
  } catch (error) {
    console.error("Error creating project:", error);
  }
});

// Serve static files from the 'dist' folder
const distPath = path.resolve(__dirname, "../client/dist");
app.use(express.static(distPath));

const port = process.env.PORT;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
