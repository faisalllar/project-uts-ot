const pool = require('./database');

const getSensorData = async () => {
  try {
    // Query untuk mendapatkan statistik suhu
    const [tempStats] = await pool.execute(`
      SELECT 
        MAX(suhu) as subumax,
        MIN(suhu) as subumin,
        AVG(suhu) as suhurata
      FROM data_sensor
    `);

    // Query untuk mendapatkan data dengan suhu dan kelembapan maksimum
    const [maxTempHumid] = await pool.execute(`
      SELECT 
        id as idx,
        suhu as suhun,
        humidity as humid,
        lux as kecerahan,
        timestamp
      FROM data_sensor 
      WHERE suhu = ? AND humidity = ?
      ORDER BY timestamp ASC
      LIMIT 2
    `, [tempStats[0].subumax, tempStats[0].subumax]);

    // Query untuk mendapatkan bulan-tahun dengan suhu maksimum
    const [monthYearMax] = await pool.execute(`
      SELECT 
        DATE_FORMAT(timestamp, '%m-%Y') as month_year
      FROM data_sensor 
      WHERE suhu = ?
      GROUP BY DATE_FORMAT(timestamp, '%m-%Y')
      ORDER BY timestamp ASC
      LIMIT 2
    `, [tempStats[0].subumax]);

    return {
      subumax: tempStats[0].subumax,
      subumin: tempStats[0].subumin,
      suhurata: parseFloat(tempStats[0].suhurata).toFixed(2),
      nilai_suhu_max_humid_max: maxTempHumid,
      month_year_max: monthYearMax
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getSensorData
};