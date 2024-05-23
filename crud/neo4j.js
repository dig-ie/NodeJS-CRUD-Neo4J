const driver = require('../config/db');
const readline = require('readline');
const neo4j = require('./crud/neo4j');
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

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  function mainMenu() {
    console.log("== CRUD Neo4j ==");
    console.log("1. Criar Usuário");
    console.log("2. Ler Usuário");
    console.log("3. Atualizar Usuário");
    console.log("4. Excluir Usuário");
    console.log("5. Exibir Todos os Usuários");
    console.log("0. Sair");
  }
  
  function createUser() {
    console.log("Opção 1: Criar Usuário");
    // Coloque aqui a lógica para criar um usuário
  }
  
  function readUser() {
    console.log("Opção 2: Ler Usuário");
    // Coloque aqui a lógica para ler um usuário
  }
  
  function updateUser() {
    console.log("Opção 3: Atualizar Usuário");
    // Coloque aqui a lógica para atualizar um usuário
  }
  
  function deleteUser() {
    console.log("Opção 4: Excluir Usuário");
    // Coloque aqui a lógica para excluir um usuário
  }
  
  function displayAllUsers() {
    console.log("Opção 5: Exibir Todos os Usuários");
    // Coloque aqui a lógica para exibir todos os usuários
  }
  
  function startApp() {
    rl.question("Escolha uma opção: ", (option) => {
      switch(option) {
        case '1':
          createUser();
          break;
        case '2':
          readUser();
          break;
        case '3':
          updateUser();
          break;
        case '4':
          deleteUser();
          break;
        case '5':
          displayAllUsers();
          break;
        case '0':
          console.log("Saindo...");
          rl.close();
          break;
        default:
          console.log("Opção inválida. Por favor, escolha uma opção válida.");
      }
      startApp(); // Continua a execução do menu após uma operação
    });
  }
  
  async function main() {
    mainMenu();
    startApp();
  }
  
  main();

module.exports = Neo4jCRUD;
