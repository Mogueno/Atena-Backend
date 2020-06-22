const db = require("../core/db");
const httpMsgs = require("../core/httpMsgs");

exports.getAllFaculdades = function (req, resp) {
  db.executeSql("SELECT FAC_INT_ID , FAC_STR_NOME FROM TB_FACULDADE", function (
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

exports.getAllCursos = function (req, resp) {
  db.executeSql("SELECT CUR_INT_ID , CUR_STR_NOME FROM TB_CURSO", function (
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

exports.getAllMaterias = function (req, resp) {
  db.executeSql("SELECT MAT_INT_ID , MAT_STR_NOME FROM TB_MATERIA", function (
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

exports.postFaculdadeData = function(req, resp, reqBody){
  try {
    if (!reqBody) throw new Error("Body missing");

    var data = JSON.parse(reqBody);

    if (data) {

      if (!data.userID) throw new Error("userID Missing");
      if (!data.facID) throw new Error("facID Missing");
      if (!data.curID) throw new Error("curID Missing");
      if (!data.matID1) throw new Error("matID1 Missing");
      if (!data.matID2) throw new Error("matID2 Missing");

        var facData = data.userID + "," +  data.facID;
        var curData = data.userID + "," + data.curID;
        var matData1 = data.userID + "," + data.matID1 ;  
        var matData2 = data.userID  + "," + data.matID2; 
        var sqlQuery =
         "INSERT INTO TB_USER_FAC (USER_INT_ID, FAC_INT_ID) VALUES ( " + facData  + 
         "); INSERT INTO TB_USER_CUR (USER_INT_ID, CUR_INT_ID) VALUES (" + curData  +
         "); INSERT INTO TB_USER_MAT (USER_INT_ID, MAT_INT_ID ) VALUES (" +  matData1 + 
         "); INSERT INTO TB_USER_MAT (USER_INT_ID, MAT_INT_ID ) VALUES (" + matData2 +
         ")";

      db.executeSql(sqlQuery, function (data, err) {
        if (err) {
          httpMsgs.sendJson(req, resp, {insertCompleted: false});
        } else {
          httpMsgs.sendJson(req, resp, {insertCompleted: true});
        }
      });
    } else {
      throw new Error("Data parse failed");
    }
  } catch (err) {
    httpMsgs.show500(req, resp, err);
  }
  
}
