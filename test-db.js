const pool = require('./database');

async function testConnection() {
  try {
    const [rows] = await pool.execute('SELECT COUNT(*) as total FROM data_sensor');
    console.log('✅ Koneksi database berhasil!');
    console.log(`📊 Total data: ${rows[0].total} records`);
    
    // Test query data
    const [data] = await pool.execute('SELECT * FROM data_sensor LIMIT 2');
    console.log('📋 Sample data:', data);
  } catch (error) {
    console.error('❌ Error koneksi database:', error.message);
  }
}

testConnection();