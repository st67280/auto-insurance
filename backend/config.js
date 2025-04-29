module.exports = {
    port: process.env.PORT || 5000,
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/auto-insurance',
    jwtSecret: process.env.JWT_SECRET || 'auto-insurance-secret-key',
    jwtExpire: process.env.JWT_EXPIRE || '7d',
    vehicleApiUrl: process.env.VEHICLE_API_URL || 'https://api.dataovozidlech.cz/api/vehicletechnicaldata/v2',
    vehicleApiKey: process.env.VEHICLE_API_KEY || '-h7dcodYev1Z4VsPZ7JnfKzrEIXqU5og'
};