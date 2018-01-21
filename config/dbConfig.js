if (process.env.NODE_ENV == 'production')
    module.exports = 'mongodb://abdo:test@ds111478.mlab.com:11478/remind-me';
else
    module.exports = 'mongodb://localhost/remind-me-dev';