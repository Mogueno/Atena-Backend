const db = require("../core/db");
const httpMsgs = require("../core/httpMsgs");
const util = require("util");

exports.getAllNotas = function (req, resp, userID) {
  db.executeSql(
    "SELECT * FROM TB_NOTA_STR\
  JOIN TB_NOTA ON TB_NOTA_STR.STR_INT_ID = TB_NOTA.STR_INT_ID\
  WHERE USER_INT_ID =" +
      userID,
    function (data, err) {
      if (err) {
        httpMsgs.show500(req, resp, err);
      } else {
        var reqSendData = [];
        data.forEach((element) => {
          reqSendData.push({
            notaID: element.NOTA_INT_ID,
            titulo: element.STR_STR_TITLE,
            conteudo: element.STR_STR_PATH,
            matID: element.MAT_INT_ID,
          });
          // reqSendData[index].titulo = element.STR_STR_TITLE
        });
        resp.writeHead(200, { "Content-Type": "application/json" });
        resp.write(JSON.stringify({ reqSendData }));
        resp.end();
      }
    }
  );
};

exports.addNota = function (req, resp, reqBody) {
  try {
    if (!reqBody) throw new Error("Input not valid");
    var datareq = JSON.parse(reqBody);
    //Insert na tabela TB_NOTA_STR

    if (datareq && datareq.userID) {
      db.executeSql(
        "INSERT INTO TB_NOTA_STR(STR_STR_TITLE, STR_STR_PATH, STR_INT_AUTHOR, STR_INT_EDITED) OUTPUT INSERTED.STR_INT_ID VALUES( '" +
          datareq.titulo +
          "' , '" +
          datareq.conteudo +
          "'," +
          datareq.userID +
          "," +
          datareq.userID +
          ")",
        function (data, err) {
          if (err) {
            throw new Error("Error in insert");
          } else if (data.length > 0) {
            //Inseriu o registro com sucesso
            db.executeSql(
              "INSERT INTO TB_NOTA (FAC_INT_ID , CUR_INT_ID, MAT_INT_ID, STR_INT_ID, USER_INT_ID) VALUES( " +
                datareq.facID +
                "," +
                datareq.curID +
                "," +
                datareq.matID +
                "," +
                data[0].STR_INT_ID +
                "," +
                datareq.userID +
                ") ",
              function (data, err) {
                if (!err) {
                  resp.writeHead(200, { "Content-Type": "application/json" });
                  resp.write(JSON.stringify({ inserted: true }));
                  resp.end();
                } else {
                  resp.writeHead(200, { "Content-Type": "application/json" });
                  resp.write(JSON.stringify({ inserted: false, err: err }));
                  resp.end();
                }
              }
            );
          } else {
            resp.writeHead(200, { "Content-Type": "application/json" });
            resp.write(JSON.stringify({ inserted: false }));
            resp.end();
          }
        }
      );
    }
  } catch (err) {
    httpMsgs.show500(req, resp, err);
  }
};

exports.getSingleNota = function (req, resp) {
  var url = req.url.split("singlenota/")[1];
  var userID = url.split("-")[0];
  var notaID = url.split("-")[1];

  if (notaID && userID) {
    db.executeSql(
      "SELECT STR_STR_TITLE, STR_STR_PATH, MAT_INT_ID FROM TB_NOTA_STR JOIN TB_NOTA ON TB_NOTA_STR.STR_INT_ID = TB_NOTA.STR_INT_ID\
        WHERE USER_INT_ID = " +
        userID +
        " AND TB_NOTA.NOTA_INT_ID = " +
        notaID,
      function (data, err) {
        if (err) {
          httpMsgs.show500(req, resp, err);
        } else {
          resp.writeHead(200, { "Content-Type": "application/json" });
          if (data.length) {
            resp.write(
              JSON.stringify({
                titulo: data[0].STR_STR_TITLE,
                conteudo: data[0].STR_STR_PATH,
                matID: data[0].MAT_INT_ID,
              })
            );
          } else {
            resp.write(
              JSON.stringify({
                data: false,
              })
            );
          }

          resp.end();
        }
      }
    );
  } else {
    resp.writeHead(200, { "Content-Type": "application/json" });
    resp.write(JSON.stringify({ err: "notaID or userID invalid" }));
    resp.end();
  }
};

exports.updateNota = function (req, resp, reqBody) {
  /**
   * userID:1,
   * notaID:2,
   * titulo:"titulo",
   * conteudo:"conteudo"
   */
  try {
    if (!reqBody) throw new Error("Body not provided");

    var data = JSON.parse(reqBody);
    db.executeSql(
      "SELECT STR_INT_ID FROM TB_NOTA WHERE NOTA_INT_ID = " + data.notaID,
      function (datanota, err) {
        if (data && data.userID && datanota[0].STR_INT_ID) {
          var sqlQuery = "UPDATE TB_NOTA_STR SET ";
          var isDataProvided = false;
          //STRING FIELDS
          if (data.titulo) {
            sqlQuery += " STR_STR_TITLE = '" + data.titulo + "',";
            isDataProvided = true;
          }
          if (data.conteudo) {
            sqlQuery += " STR_STR_PATH = '" + data.conteudo + "',";
            isDataProvided = true;
          }
          if (data.userID) {
            sqlQuery += " STR_INT_EDITED = '" + data.userID + "',";
            isDataProvided = true;
          }
          //END STRING FIELDS
          //Remove a ultima virgula da query sqlQuery
          sqlQuery = sqlQuery.slice(0, -1);
          //Adiciona WHERE ao patch
          sqlQuery += " WHERE STR_INT_ID = " + datanota[0].STR_INT_ID;

          db.executeSql(sqlQuery, function (data, err) {
            if (err) {
              resp.writeHead(200, { "Content-Type": "application/json" });
              resp.write(JSON.stringify({ patched: false, err: err }));
              resp.end();
            } else {
              resp.writeHead(200, { "Content-Type": "application/json" });
              resp.write(JSON.stringify({ patched: true }));
              resp.end();
            }
          });
        } else {
          throw new Error("Input not valid");
        }
      }
    );
  } catch (err) {
    httpMsgs.show500(req, resp, err);
  }
};

exports.deleteNota = function (req, resp) {
  var notaID = req.url.split("notadelete/")[1];

  try {
    db.executeSql(
      "SELECT STR_INT_ID FROM TB_NOTA WHERE NOTA_INT_ID = " + notaID,
      function (data, err) {
        console.log("data", data[0].STR_INT_ID);
        var sqlQuery = "DELETE FROM TB_NOTA ";
        sqlQuery += " WHERE STR_INT_ID = " + data[0].STR_INT_ID;
        sqlQuery += " ;DELETE FROM TB_NOTA_STR ";
        sqlQuery += " WHERE STR_INT_ID = " + data[0].STR_INT_ID;
        db.executeSql(sqlQuery, function (data, err) {
          if (err) {
            resp.writeHead(200, { "Content-Type": "application/json" });
            resp.write(JSON.stringify({ deleted: true }));
            resp.end();
          } else {
            resp.writeHead(200, { "Content-Type": "application/json" });
            resp.write(JSON.stringify({ deleted: true }));
            resp.end();
          }
        });
      }
    );
    //Verificar se tem mais de uma nota restante
  } catch (err) {
    httpMsgs.show500(req, resp, err);
  }
};
