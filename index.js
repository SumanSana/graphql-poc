import { ApolloServer } from "apollo-server-express";
import { typeDefs} from "./graphql/schema.js";
import { resolvers } from "./graphql/resolver.js";
import express from "express";

const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {return {"message":error.message}}
});

(async () => {
    await server.start();
    server.applyMiddleware({app});
})();

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
