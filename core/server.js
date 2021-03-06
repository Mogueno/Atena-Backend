const http = require("http");
const usuarioController = require("../controllers/usuarioController");
const faculdadeController = require("../controllers/faculdadeController");
const notasController = require("../controllers/notasController");
const settings = require("../settings");
const httpMsgs = require("./httpMsgs");
const validate = require("../util/validate");

http
  .createServer(function (req, resp) {
    switch (req.method) {
      case "GET":
        if (req.url === "/") {
          // ROTA '/'
          httpMsgs.showHome(req, resp); //Retorna a mensagem que descreve as rotas da api
        } else if (req.url === "/usuarios") {
          // ROTA '/usuarios'
          usuarioController.getAllUsers(req, resp); // Retorna todos os usuarios
        }else if(req.url ==="/faculdades"){
          // ROTA '/faculdades'
          faculdadeController.getAllFaculdades(req ,resp)
        }else if(req.url === '/cursos'){
          //ROTA '/cursos'
          faculdadeController.getAllCursos(req, resp)
        }else if(req.url === '/materias'){
          //ROTA '/materias'
          faculdadeController.getAllMaterias(req, resp)
        }else if(req.url.indexOf('/notas/') != -1) {
          //ROTA '/notas/:userID'
          const userID = validate.IdNota(req.url);
          if (userID) {
            notasController.getAllNotas(req, resp, userID); // Busca o usuario do id solicitado
          } else {
            httpMsgs.show404(req, resp);
          }
        }else if(req.url.indexOf('/login/') != -1 ){
            //ROTA '/login'
            usuarioController.loginUser(req, resp)
        }else if(req.url.indexOf('/singlenota/') != -1){
            //ROTA '/singlenota/:userID-:notaID'
            notasController.getSingleNota(req, resp)
        }else{
          // ROTA '/usuario/:id'
          const userID = validate.IdUser(req.url); //Verifica se o '/usuario/:id' foi enviado
          if (userID) {
            usuarioController.getUser(req, resp, userID); // Busca o usuario do id solicitado
          } else {
            httpMsgs.show404(req, resp);
          }
        }
        break;

      case "POST":
        if (req.url === "/usuario") {
          // ROTA '/usuario'
          var reqBody = "";
          req.on("data", function (data) {
            reqBody += data;
            if (reqBody.length > 1e7) {//10mb
              httpMsgs.show413(req, resp);
            }
          });
          req.on("end", function () {
            usuarioController.addUser(req, resp, reqBody);
          });
        }else if(req.url ==='/facdata'){
        // ROTA '/facdata'
        var reqBody = "";
        req.on("data", function (data) {
          reqBody += data;
          if (reqBody.length > 1e7) {//10mb
            httpMsgs.show413(req, resp);
          }
        });
        req.on("end", function () {
          faculdadeController.postFaculdadeData(req, resp, reqBody);
        });
        }else if(req.url ==='/notadata'){
        // ROTA '/facdata'
        var reqBody = "";
        req.on("data", function (data) {
          reqBody += data;
          if (reqBody.length > 1e7) {//10mb
            httpMsgs.show413(req, resp);
          }
        });
        req.on("end", function () {
          notasController.addNota(req, resp, reqBody);
        });
        }else {
          httpMsgs.showPostError(req, resp);
        }
        break;

      case "DELETE":
        if (req.url === "/") {
          httpMsgs.show404(req, resp);
        }else if(req.url.indexOf('/notadelete/') != -1){
          notasController.deleteNota(req, resp)
        } else {
          const userID = validate.IdUser(req.url);
          if (userID) {
            usuarioController.deleteUser(req, resp, userID);
          } else {
            httpMsgs.showIdError(req, resp);
          }
        }
        break;

      case "PATCH":
        if (req.url === "/") {
          httpMsgs.show404(req, resp);
        }else if(req.url.indexOf("/notapatch/") != -1){
          var reqBody = "";
          req.on("data", function (data) {
            reqBody += data;
            if (reqBody.length > 1e7) {//10mb
              httpMsgs.show413(req, resp);
            }
          });
          req.on("end", function () {
            notasController.updateNota(req, resp, reqBody)
          });
        } else {
          const userID = validate.IdUser(req.url);
          if (userID) {
            var reqBody = "";
            req.on("data", function (data) {
              reqBody += data;
              if (reqBody.length > 1e7) {//10mb
                httpMsgs.show413(req, resp);
              }
            });
            req.on("end", function () {
              usuarioController.updateUser(req, resp, reqBody, userID);
            });
          } else {
            httpMsgs.showPatchError(req, resp);
          }
        }
        break;

      default:
        httpMsgs.show404(req, resp);
        break;
    }
  })
  .listen(settings.port.default, function () {
    console.log(`Listening on ${settings.port.default}`);
  });
