const express = require('express');
const cors = require('cors'); // Import the cors package
const app = express();
const port = 5000;

// Enable CORS for all origins (you can configure it to be more restrictive)
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

// POST route to handle wallet ID submission
app.post('/api/submit-wallet', (req, res) => {
  const { walletId } = req.body;

  if (!walletId) {
    return res.status(400).json({ error: 'Wallet ID is required' });
  }

  console.log('Received wallet ID:', walletId);

  // You can add additional logic here, e.g., save to a database or process the data
  res.status(200).json({ message: 'Wallet ID received successfully', walletId });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
