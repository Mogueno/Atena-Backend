const db = require("../core/db");
const httpMsgs = require("../core/httpMsgs");

exports.getAllFaculdades = function(req, resp){
    db.executeSql("SELECT FAC_INT_ID , FAC_STR_NOME FROM TB_FACULDADE", function (data, err) {
        if (err) {
          httpMsgs.show500(req, resp, err);
        } else {
          httpMsgs.sendJson(req, resp, data);
        }
      });
}