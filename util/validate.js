exports.IdUser = function (reqUrl) {
  var userID;
  var userIDRegExp = "[0-9]+";
  var patt = new RegExp("/usuario/" + userIDRegExp);
  if (patt.test(reqUrl)){
    patt = new RegExp(userIDRegExp);
    userID = patt.exec(reqUrl);
    return userID;
  }else{
    return false;
    }
};

exports.IdNota = function (reqUrl) {
  var userID;
  var userIDRegExp = "[0-9]+";
  var patt = new RegExp("/notas/" + userIDRegExp);
  if (patt.test(reqUrl)){
    patt = new RegExp(userIDRegExp);
    userID = patt.exec(reqUrl);
    return userID;
  }else{
    return false;
  }
};

