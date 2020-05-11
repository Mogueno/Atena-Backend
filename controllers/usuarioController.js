const db = require("../core/db");
const httpMsgs = require("../core/httpMsgs");
const util = require("util");

exports.getAllUsers = function (req, resp) {
  db.executeSql("SELECT * FROM TB_USER", function (data, err) {
    if (err) {
      httpMsgs.show500(req, resp, err);
    } else {
      httpMsgs.sendJson(req, resp, data);
    }
  });
};

exports.addUser = function (req, resp, reqBody) {
  try {
    if (!reqBody) throw new Error("Input not valid");
    var data = JSON.parse(reqBody);
    if (data) {
      var sqlQuery =
        "INSERT INTO TB_USER (USER_STR_NOME, USER_INT_IDADE, USER_STR_SEXO, USER_STR_EMAIL, USER_STR_SENHA, USER_STR_FACEBOOKLOGIN, USER_STR_GOOGLELOGIN) OUTPUT INSERTED.USER_INT_ID VALUES";
      sqlQuery += util.format(
        " ('%s', %d, '%s', '%s', '%s', %d, %d)",
        data.userName,
        data.userIdade,
        data.userSexo,
        data.userEmail,
        data.userSenha,
        data.userF,
        data.userG
      );
      db.executeSql(sqlQuery, function (data, err) {
        if (err) {
          httpMsgs.show500(req, resp, err);
        } else {
          httpMsgs.sendJson(req, resp, data);
        }
      });
    } else {
      throw new Error("Input not valid");
    }
  } catch (err) {
    httpMsgs.show500(req, resp, err);
  }
};

exports.getUser = function (req, resp, userID) {
  db.executeSql("SELECT * FROM TB_USER WHERE USER_INT_ID=" + userID, function (
    data,
    err
  ) {
    if (err) {
      httpMsgs.show500(req, resp, err);
    } else {
      httpMsgs.sendJson(req, resp, data);
    }
  });
};

exports.updateUser = function (req, resp, reqBody, userID) {
  try {
    if (!reqBody) throw new Error("Body not provided");
    if (!userID) throw new Error("userID not provided");

    var data = JSON.parse(reqBody);
    if (data) {
      var sqlQuery = "UPDATE TB_USER SET ";
      var isDataProvided = false;
      //STRING FIELDS
      if (data.userName) {
        sqlQuery += " USER_STR_NOME = '" + data.userName + "',";
        isDataProvided = true;
      }
      if (data.userSexo) {
        sqlQuery += " USER_STR_SEXO = '" + data.userSexo + "',";
        isDataProvided = true;
      }
      if (data.userEmail) {
        sqlQuery += " USER_STR_EMAIL = '" + data.userEmail + "',";
        isDataProvided = true;
      }
      if (data.userSenha) {
        sqlQuery += " USER_STR_SENHA = '" + data.userSenha + "',";
        isDataProvided = true;
      }
      //END STRING FIELDS
      //INT FIELDS
      if (data.userIdade) {
        sqlQuery += " USER_INT_IDADE = " + data.userIdade + ",";
        isDataProvided = true;
      }
      if (data.userF) {
        sqlQuery += " USER_STR_FACEBOOKLOGIN = " + data.userF + ",";
        isDataProvided = true;
      }
      if (data.userG) {
        sqlQuery += " USER_STR_GOOGLELOGIN = " + data.userG + ",";
        isDataProvided = true;
      }
      //END INT FIELDS
      //Remove a ultima virgula da query sqlQuery
      sqlQuery = sqlQuery.slice(0, -1);

      //Adiciona WHERE ao patch
      sqlQuery += " WHERE USER_INT_ID = " + userID;
      console.log("sql query", sqlQuery)
      db.executeSql(sqlQuery, function (data, err) {
        if (err) {
          console.log("caiu aqui")
          httpMsgs.show500(req, resp, err);
        } else {
          httpMsgs.send200(req, resp);
        }
      });
    } else {
      throw new Error("Input not valid");
    }
  } catch (err) {
    console.log("caiu")
    httpMsgs.show500(req, resp, err);
  }
};

exports.deleteUser = function (req, resp, userID) {
  try {
    if (!userID) throw new Error("Body not provided");
    if (userID) {
      var sqlQuery = "DELETE FROM TB_USER ";
      //Adiciona WHERE ao delete
      sqlQuery += " WHERE USER_INT_ID = " + userID;
      db.executeSql(sqlQuery, function (data, err) {
        if (err) {
          httpMsgs.show500(req, resp, err);
        } else {
          httpMsgs.send200(req, resp);
        }
      });
    } else {
      throw new Error("userID not provided");
    }
  } catch (err) {
    httpMsgs.show500(req, resp, err);
  }
};
