import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createServer as createViteServer } from 'vite';
import { getDB, saveDB } from './server/db';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(bodyParser.json());

  // API Routes
  app.get('/api/data', (req, res) => {
    const data = getDB();
    res.json(data);
  });

  app.post('/api/data', (req, res) => {
    const { users, logs, accounts, transactions, tasks, transfers, contractRecords, currentUser } = req.body;
    const newData = saveDB({ users, logs, accounts, transactions, tasks, transfers, contractRecords, currentUser });
    res.json(newData);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving (if needed)
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
