import '@/config/env.js';
import { env } from '@/config/env.js';
import { createApp } from '@/app/app.js';
import { connectDB } from '@/infrastructure/db.js';
import { logger } from '@/infrastructure/logger.js';

await connectDB(env.MONGO_URI);

const app = createApp();

app.listen(env.PORT, () => {
  logger.info({ port: env.PORT }, 'Auth service is running');
});
