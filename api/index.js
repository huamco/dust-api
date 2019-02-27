module.exports = function(app){
    app.use('/company', require('./company'));
    app.use('/users', require('./users'));
    app.use('/dusts', require('./dusts'));
    app.use('/dustLocation', require('./dustLocation'));
    app.use('/dustConfig', require('./dustConfig'));
    app.use('/login', require('./login'));
    app.use('/uploadImage', require('./image'));
    app.use('/packetData', require('./packetData'));
}