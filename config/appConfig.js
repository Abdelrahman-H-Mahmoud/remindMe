module.exports={
    "DbUrl":process.env.NODE_ENV=='production'?'mongodb://abdo:test@ds111478.mlab.com:11478/remind-me':'mongodb://localhost/remind-me-dev',
    "port":process.env.PORT || 3000
}