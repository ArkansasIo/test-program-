import { createRailwayServer } from './railwayServer';

const app = createRailwayServer();
const port = Number(process.env.PORT ?? 3001);

app.listen(port, () => {
  console.log(`Railway Operations API listening on http://localhost:${port}`);
});
