import express from 'express';
import { authMicrosoftRouter } from './routes/authMicrosoft.js';
import { integrationsMicrosoftRouter } from './routes/integrationsMicrosoft.js';

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/auth/microsoft', authMicrosoftRouter);
app.use('/integrations/microsoft', integrationsMicrosoftRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.info(`Server listening on port ${port}`);
});
