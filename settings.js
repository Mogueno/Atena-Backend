exports.dbConfig = {
    user: "AtenaAdm",
    password: "Murilo1234",
    server: "ccstecno.ddns.net",
    database: "Atena",
    port: 1433 // default port for sql server
}

//Only use this port for Azure Web Service deploy.
exports.port = {
     default: process.env.PORT || 1337
};
