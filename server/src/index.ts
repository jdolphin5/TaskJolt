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

/*
async function main() {
  const taskArray = await prisma.task.findMany({
    include: {
      notes: {},
    },
  });

  console.log(taskArray[0].notes[0]);
}
*/

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
      const { tasksObject } = req.query;

      const taskIdArray = tasksObject.split(",").map(Number);

      const data = await prisma.notes.findMany({
        where: {
          task_id: {
            in: taskIdArray,
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

// Serve static files from the 'dist' folder
const distPath = path.resolve(__dirname, "../client/dist");
app.use(express.static(distPath));

const port = process.env.PORT;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
