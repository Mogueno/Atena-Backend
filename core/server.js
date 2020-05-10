const http = require("http");
const usuarioController = require("../controllers/usuario");
const settings = require("../settings");
const httpMsgs = require("./httpMsgs");

http
  .createServer(function (req, resp) {
    switch (req.method) {
      case "GET":
          if(req.url === "/"){
            httpMsgs.showHome(req, resp);
          }else if(req.url === "/usuarios"){
            usuarioController.getAllUsers(req, resp)
          }else{
              var userID = "[0-9]+";
              var patt = new RegExp("/usuario/" + userID);
              if(patt.test(req.url)){
                  patt = new RegExp(userID);
                  var userID = patt.exec(req.url);
                  usuarioController.getUser(req, resp, userID)
              }else{
                  httpMsgs.show404(req, resp)
              }
          }
        break;

      case "POST":
        if(req.url === "/usuario"){
            var reqBody = '';
            req.on("data", function(data){
                reqBody += data;
                if(reqBody.length > 1e7){ //10mb
                    httpMsgs.show413(req, resp);
                }
            });
            req.on("end", function(){
                usuarioController.addUser(req, resp, reqBody);
            });
        }else{
            httpMsgs.show404(req, resp);
        }
        break;

      case "DELETE":
        if(req.url === "/usuario"){
          var reqBody = '';
          req.on("data", function(data){
              reqBody += data;
              if(reqBody.length > 1e7){ //10mb
                  httpMsgs.show413(req, resp);
              }
          });
          req.on("end", function(){
              usuarioController.deleteUser(req, resp, reqBody);
          });
      }else{
          httpMsgs.show404(req, resp);
      }
        break;

      case "PATCH":
        if(req.url === "/usuario"){
          var reqBody = '';
          req.on("data", function(data){
              reqBody += data;
              if(reqBody.length > 1e7){ //10mb
                  httpMsgs.show413(req, resp);
              }
          });
          req.on("end", function(){
              usuarioController.updateUser(req, resp, reqBody);
          });
      }else{
          httpMsgs.show404(req, resp);
      }
        break;

      default:
        break;
    }
  })
  .listen(settings.port.default, function () {
    console.log(`Listening on ${settings.port.default}`);
  });
