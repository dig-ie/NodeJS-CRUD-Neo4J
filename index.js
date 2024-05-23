const express = require('express');
const bodyParser = require('body-parser');
const Neo4jCRUD = require('./crud/neo4j');

const app = express();
const port = 3000;
const crud = new Neo4jCRUD();

app.use(bodyParser.json());

// Create
app.post('/node', async (req, res) => {
  const { label, properties } = req.body;
  try {
    const node = await crud.createNode(label, properties);
    res.status(201).json(node);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read
app.get('/node', async (req, res) => {
  const { label, propertyKey, propertyValue } = req.query;
  try {
    const nodes = await crud.readNode(label, propertyKey, propertyValue);
    res.status(200).json(nodes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update
app.put('/node', async (req, res) => {
  const { label, propertyKey, propertyValue, updateProperties } = req.body;
  try {
    const node = await crud.updateNode(label, propertyKey, propertyValue, updateProperties);
    res.status(200).json(node);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete
app.delete('/node', async (req, res) => {
  const { label, propertyKey, propertyValue } = req.body;
  try {
    const deletedCount = await crud.deleteNode(label, propertyKey, propertyValue);
    res.status(200).json({ deletedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
