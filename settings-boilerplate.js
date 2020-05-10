exports.dbConfig = {
    user: "yourusername",
    password: "yourpassword",
    server: "yourserver",
    database: "yourdatabase",
    port: 1433 // default port for sql server
}

//Only use this port for Azure Web Service deploy.
exports.port = {
     default: process.env.PORT || 1337
};
