exports.dbConfig = {
    user: "atenaadmin",
    password: "mogueno1234!@#$",
    server: "atenaserver.database.windows.net",
    database: "atenadatabase",
    options:{
        encrypt:"true"
    },
    port: 1433 // default port for sql server
}

//Only use this port for Azure Web Service deploy.
exports.port = {
     default: process.env.PORT || 1337
};
