// services/neo4jService.js
const neo4j = require('neo4j-driver');

const uri = process.env.NEO4J_URI;       // should now be defined
const user = process.env.NEO4J_USER;
const password = process.env.NEO4J_PASSWORD;

console.log('NEO4J_URI:', process.env.NEO4J_URI);
console.log('NEO4J_USER:', process.env.NEO4J_USER);
console.log('NEO4J_PASSWORD:', process.env.NEO4J_PASSWORD);

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

async function runQuery(cypher, params = {}) {
  const session = driver.session();
  try {
    const result = await session.run(cypher, params);
    return result.records;
  } catch (error) {
    console.error('Neo4j query error:', error);
    throw error;
  } finally {
    await session.close();
  }
}


module.exports = { runQuery, driver };
