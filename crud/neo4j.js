const driver = require('../config/db');

class Neo4jCRUD {
  async createNode(label, properties) {
    const session = driver.session();
    try {
      const result = await session.writeTransaction(tx =>
        tx.run(
          `CREATE (n:${label} $properties) RETURN n`,
          { properties }
        )
      );
      return result.records[0].get('n');
    } finally {
      await session.close();
    }
  }

  async readNode(label, propertyKey, propertyValue) {
    const session = driver.session();
    try {
      const result = await session.readTransaction(tx =>
        tx.run(
          `MATCH (n:${label} {${propertyKey}: $propertyValue}) RETURN n`,
          { propertyValue }
        )
      );
      return result.records.map(record => record.get('n'));
    } finally {
      await session.close();
    }
  }

  async updateNode(label, propertyKey, propertyValue, updateProperties) {
    const session = driver.session();
    try {
      const setClause = Object.keys(updateProperties)
        .map(key => `n.${key} = $${key}`)
        .join(', ');
      const params = { propertyValue, ...updateProperties };
      const result = await session.writeTransaction(tx =>
        tx.run(
          `MATCH (n:${label} {${propertyKey}: $propertyValue}) SET ${setClause} RETURN n`,
          params
        )
      );
      return result.records[0].get('n');
    } finally {
      await session.close();
    }
  }

  async deleteNode(label, propertyKey, propertyValue) {
    const session = driver.session();
    try {
      const result = await session.writeTransaction(tx =>
        tx.run(
          `MATCH (n:${label} {${propertyKey}: $propertyValue}) DETACH DELETE n`,
          { propertyValue }
        )
      );
      return result.summary.counters.updates().nodesDeleted;
    } finally {
      await session.close();
    }
  }
}

module.exports = Neo4jCRUD;
