import express from 'express';
import cors from 'cors';
import bfhlRoutes from './routes/bfhl.routes.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '1kb' }));

app.use('/bfhl', bfhlRoutes);

app.use((err, _req, res, _next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ is_success: false, error: 'Invalid JSON' });
  }
  res.status(500).json({ is_success: false, error: 'Internal server error' });
});

export default app;
