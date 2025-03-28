import express, { Request, Response } from 'express';
import path from 'node:path';
import db from './config/connection.js';
import typeDefs from './schema/typedefs.js';
import resolvers from './schema/resolvers.js';
import { ApolloServer } from '@apollo/server';
import { authenticateToken } from './services/auth.js';
import { expressMiddleware } from '@apollo/server/express4';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApolloServer=async()=>{
  await server.start();
  db;
  
  const PORT = process.env.PORT || 3001;
  const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/graphql",expressMiddleware(server as any,
  {
    context: authenticateToken as any
  }
));

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')));
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
  });
}


// console.log("before db connection");
// db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
});
}
startApolloServer();