const express = require('express');
const cors = require('cors');
const config = require('./config');
const { getSensorData } = require('./queries');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint untuk data sensor
app.get('/sensor-data', async (req, res) => {
  console.log('📡 Request received at /sensor-data');
  try {
    const sensorData = await getSensorData();
    console.log('✅ Data fetched successfully');
    
    // Format response sesuai dengan contoh soal
    const response = {
      subumax: sensorData.subumax,
      subumin: sensorData.subumin,
      suhurata: parseFloat(sensorData.suhurata),
      nilai_suhu_max_humid_max: sensorData.nilai_suhu_max_humid_max.map((item, index) => ({
        [String.fromCharCode(111 + index)]: { // 'o', 'i', dst
          idx: item.idx,
          suhun: item.suhun,
          humid: item.humid,
          kecerahan: item.kecerahan,
          timestamp: item.timestamp
        }
      })),
      month_year_max: sensorData.month_year_max.map((item, index) => ({
        [String.fromCharCode(111 + index)]: { // 'o', 'i', dst
          month_year: item.month_year
        }
      }))
    };

    console.log('📤 Sending response...');
    res.json(response);
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Endpoint untuk testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'IoT Hydroponic Backend API',
    endpoints: {
      sensor_data: '/sensor-data'
    }
  });
});

// Start server
app.listen(config.server.port, () => {
  console.log(`🚀 Server running on http://localhost:${config.server.port}`);
  console.log(`📊 Sensor data endpoint: http://localhost:${config.server.port}/sensor-data`);
});