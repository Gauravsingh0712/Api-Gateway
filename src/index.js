const express = require('express');
const rateLimit = require('express-rate-limit')
const { createProxyMiddleware } = require('http-proxy-middleware')

const { ServerConfig } = require('./config');
const apiRoutes = require('./routes');
const serverConfig = require('./config/server-config');

const limiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minutes
    limit: 3, // Limit each IP to 3 requests per `window` (here, per 2 minutes).
})

const app = express();
app.use(express.json({ limit: '20mb' }))
app.use(express.urlencoded({ extended: false, limit: '20mb' }))

// Apply the rate limiting middleware to all requests.
app.use(limiter)
app.use('/api', apiRoutes);

app.use('/flightsService', createProxyMiddleware({ target: serverConfig.FLIGHT_SERVICE, changeOrigin: true }))
app.use('/bookingService', createProxyMiddleware({ target: serverConfig.BOOKING_SERVICE, changeOrigin: true }))

app.listen(ServerConfig.PORT, () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
});
