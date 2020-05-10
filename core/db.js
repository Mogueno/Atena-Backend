const sqlDb = require("mssql");
const settings = require("../settings");

exports.executeSql = function (sql, callback) {
  //Inicializa a conexao com as configurações do banco
  const conn = new sqlDb.Connection(settings.dbConfig);
  conn
    .connect()
    .then(function () {
      const req = new sqlDb.Request(conn);
      req
        .query(sql)
        .then(function (recordset) {
          callback(recordset);
        })
        .catch(function (err) {
          //Erro na Query SQL
          console.log(err);
          callback(null, err);
        });
    })
    .catch(function (err) {
      //Erro na conexao com o SQL
      console.log(err);
      callback(null, err);
    });
};
