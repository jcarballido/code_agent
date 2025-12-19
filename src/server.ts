import { app } from './app.js';

const start = async () => {
  try {
    await app.listen({ port: 3000 });
    console.log('Dev server started!')
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
