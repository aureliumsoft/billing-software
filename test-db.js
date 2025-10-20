const initSqlJs = require('sql.js');

async function testDatabase() {
  try {
    console.log('Loading SQL.js...');
    const SQL = await initSqlJs();
    console.log('SQL.js loaded successfully!');
    
    const db = new SQL.Database();
    console.log('Database created!');
    
    db.run("CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT)");
    db.run("INSERT INTO test VALUES (1, 'Hello World')");
    
    const stmt = db.prepare("SELECT * FROM test");
    stmt.step();
    const row = stmt.getAsObject();
    console.log('Query result:', row);
    stmt.free();
    
    console.log('Database test PASSED ✓');
    process.exit(0);
  } catch (error) {
    console.error('Database test FAILED ✗');
    console.error('Error:', error);
    process.exit(1);
  }
}

testDatabase();


