const path = require('path'); // Add the 'path' module
const express = require("express");
const app = express();
const { Pool } = require('pg');
const cors = require('cors');
//app.set('quiet', false);
console.log('test');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'quizgame',
  password: 'super',
  port: 5432, // Default
});
// Enable CORS
app.use(cors());
// Serve static files from the 'dist' folder
const distPath = path.resolve(__dirname, '../client/dist');
app.use(express.static(distPath));
// Remember that security is crucial when setting up a server-side API.
// Make sure to validate user input and sanitize SQL queries to prevent SQL injection attacks.

app.get('/api/quiz/:id', async (req: any, res: any) => {
  try {
    console.log('trying get request');
    const quizId = req.params.id;
    console.log("GET /api/quiz/", req.params.id);
    const client = await pool.connect();
    const query = `SELECT * FROM quiz WHERE quiz_id = ${quizId};`;
    const result = await client.query(query);
    client.release();
    res.json(result.rows);
  } catch (err) {
    console.log('Error fetching quiz data');
    res.status(500).json({ error: 'Error fetching quiz data' });
  }
});
const port = process.env.PORT || 3000;
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});