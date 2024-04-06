const path = require("path"); // Add the 'path' module
const express = require("express");
const app = express();

const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const allUsers = await prisma.users.findMany();
  console.log(allUsers);
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

// Serve static files from the 'dist' folder
const distPath = path.resolve(__dirname, "../client/dist");
app.use(express.static(distPath));

const port = process.env.PORT;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
