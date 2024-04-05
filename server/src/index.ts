const path = require("path"); // Add the 'path' module
const express = require("express");
const app = express();

console.log("test");

// Serve static files from the 'dist' folder
const distPath = path.resolve(__dirname, "../client/dist");
app.use(express.static(distPath));

const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
