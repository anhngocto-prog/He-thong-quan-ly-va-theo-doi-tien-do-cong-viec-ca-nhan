const mssql = require('mssql/msnodesqlv8');

const config = {
    connectionString: 'Driver={ODBC Driver 17 for SQL Server};Server=DESKTOP-SQL3PJN\\SQLEXPRESS;Database=PersonalTaskManager;Trusted_Connection=yes;'
};

const connectDB = async () => {
    try {
        const pool = await mssql.connect(config);
        console.log('🎉 Kết nối SQL Server qua Windows Authentication thành công mĩ mãn!');
        return pool;
    } catch (error) {
        console.error('❌ Kết nối SQL Server thất bại: ', error.message);
        process.exit(1);
    }
};

module.exports = { mssql, connectDB };