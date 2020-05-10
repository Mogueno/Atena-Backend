exports.show500 = function(req, resp, err){
    resp.writeHead(500, "Internal Error", { "Content-Type" : "application/json" });
    resp.write(JSON.stringify({ data:"Internal error", err: err }));
    resp.end();
}
exports.send200 = function(req, resp){
    resp.writeHead(200, { "Content-Type" : "application/json" });
    resp.end();
}
exports.showHome = function(req, resp){
    resp.writeHead(200, { "Content-Type": "application/json" });
    resp.write(JSON.stringify([
        //Descricao de todas as rotas disponiveis
        {url: "/usuarios", method: "GET" ,description: "Get all users from table TB_USER"},
        {url: "/usuario/:userID", method: "GET" ,description: "Get user with userID from table TB_USER"},
        {url: "/usuario", method: "PATCH" ,description: "Update user data from table TB_USER", body: {
            "userID": 1,
            "userName": "Nome",
            "userIdade": 10,
            "userSexo": "M",
            "userEmail":"email@email.com",
            "userSenha": "password",
            "userF": 0,
            "userG": 1
        }},
        {url: "/usuario", method: "DELETE" ,description: "Delete user data from table TB_USER", body:{
            "userID":1
        }},

    ]))
    resp.end();
}
exports.sendJson = function(req, resp, data){
    resp.writeHead( 200, { "Content-Type": "application/json" });
    if(data){
        resp.write(JSON.stringify(data));
    }
    resp.end();
}
exports.show404 = function(req, resp){
    resp.writeHead(404, { "Content-Type": "application/json" });
    resp.write(JSON.stringify({ data:"Method not suported" }));
    resp.end();
}
exports.show413 = function(req, resp){
    resp.writeHead(413, { "Content-Type": "application/json" });
    resp.write(JSON.stringify({ data:"Request Entity Too Large" }));
    resp.end();
}