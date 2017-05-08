var staticServer = require("./static-server");
//var config = require("../config/config");
//var mongo = require('mongodb').MongoClient;
//var url = config.url;
var url = 'mongodb://localhost:27017/Condos'
//cargando una liberia que
//permite persear la informacion
//de formularios
var querystring = require('querystring');
//Archivo que contiene los
//manejadores correspondientes
//al "api" de mi aplicacion 
var colors = require('colors');
var author = {
    "name": "Emmanuel Gomez",
    "department": "Computers and Systems",
    "university": "TecNM -ITGAM"
};

//manejadores
var getAuthorInfo = function (req, res) {
    //estableciendo el mime apropiado
    //para dar a conocer al navegador
    //que se enviara un json
    res.writeHead(200, {
        "Content-Type": "application/json"
    });
    //serializar
    var jsonResponse = JSON.stringify(author);
    res.end(jsonResponse);
}

var getServerName = function (req, res) {
    console.log("Respondiendo Nombre del servidor...\n");
    res.end(`>Servidor Halcones Peregrinos`);
}

var getServerTime = function (req, res) {
    var d = new Date(),
        horas = d.getHours(),
        minutos = d.getMinutes(),
        segundos = d.getSeconds();
    hora = `${horas}:${minutos}:${segundos}`;
    console.log("Respondiendo Nombre del servidor...\n");

    if (horas >= 0 && horas < 12) {
        res.end('<body background="../img/dia.jpg" id="fondo" > <h1>' +
            '<font color="white">' + `>Buenos Dias la hora actual del server: ${hora}` + '</font>' +
            '</h1> </body>');
    }
    if (horas >= 12 && horas < 18) {
        res.end('<body background="../img/tarde.jpg" id="fondo" > <h1>' +
            '<font color="white">' + `> Buenas Tardes la hora actual del server es: ${hora}` + '</font>' +
            '</h1> </body>');
    }
    if (horas >= 18 && horas < 24) {

        res.end('<body background="../img/noche.jpg"> <h1>' +
            '<font color="white">' + `>Buenas Noches la hora actual del server es: ${hora}` + '</font>' +
            '</h1> </body>');
    }
}

var getPostRoot = function (req, res) {
    //viendo el tipo de peticion
    if (req.method === "POST") {
        //Procesar un formulario
        var postData = "";
        //create a listener
        //event driven programming
        //creando un listener ante
        //la llegada de datos
        req.on("data", function (dataChunk) {
            postData += dataChunk;//concatenacion
            //agregando seguridad al asunto
            if (postData.length > 1e6) {
                //Destruir a conexion
                console.log("> Actividad maliciosa detectada por parte de un cliente D:")
                req.connection.destroy();
            }
        });
        //registrando otro listener ante un cierre
        //de conexion
        req.on("end", function () {
            //rescatar los datos recibidos 
            //del cliente
            console.log(`>Data Received: ${postData}`.data);
            var data = querystring.parse(postData);
            //Replicar los datos recibidos
            res.writeHead(200, {
                'Content-Type': "text/html"
            });

            // var docs = data;

            // res.write(`<p> ${JSON.stringify(data)}</p>`);
            mongo.connect(url, function (err, db) {
                if (err) throw err
                var collection = db.collection('contenido')
                collection.insert(data, function (err, documents) {
                    if (err){
                            console.log(err);
                        res.write('<head><meta charset="UTF-8"> <link rel="stylesheet" href="css/site.css"></head>');
                        res.write('<body style="background:darkcyan" ALIGN=CENTER>');
                        res.write('<h1 style="color:cyan">*****************************************************************************************</h1>');
                        res.write(`<h1 style="color:cyan">EL REGISTRO NO SE COMPLETO CORRECTAMENTE SE REPITE EL ID !!</h1>
                                   <h1 style="color:cyan">*****************************************************************************************</h1>`);
                        res.write('<img SRC="../img/mongo.jpg"></img></br>')
                        res.write(`<div class="col-xs-offset-2 col-xs-10">
                        <input 
                        type="button" 
                        onclick=" location.href='http://127.0.0.1:3000' "
                        value="Regresar" 
                        name="boton"
                        class="btn btn-primary" />
                        </div>`);
                        res.write('</body>');
                    }
                    else {
                        res.write('<head><meta charset="UTF-8"> <link rel="stylesheet" href="css/site.css"></head>');
                        res.write('<body style="background:darkcyan" ALIGN=CENTER>');
                        res.write(`<h1 style="color:cyan">*********************************************************************</h1>`);
                        res.write(`<h1 style="color:cyan">EL REGISTRO FUE EXITOSO !!</h1>
                        <h1 style="color:cyan">*********************************************************************</h1>`);
                        res.write(`<h1 style="color:cyan">Datos recibidos</h1>
                        <h1 style="color:cyan">*********************************************************************</h1>`);
                        for (var key in data) {
                            if (Object.prototype.hasOwnProperty.call(data, key)) {
                                res.write(
                                    `<li style="color:cyan">${key.toString().toUpperCase()} : ${data[key]}</li>`);
                            }
                        }
                        
                        res.write(`<h1 style="color:cyan">*********************************************************************</h1>`);
                         res.write(`<div class="col-xs-offset-2 col-xs-10">
                        <input 
                        type="button" 
                        onclick=" location.href='http://127.0.0.1:3000' "
                        value="Regresar" 
                        name="boton"
                        class="btn btn-primary" />
                        </div>`);
                        res.write('</body>');
                        
                    }
                    db.close()
                    res.end();
                })
            })
        });
    } else {
        //se sirve el index.html
        console.log(">se solicita la raiz con Get".red);
        staticServer.serve(req, res);
    }

}

var getfind = function (req, res) {

    mongo.connect(url, function (err, db) {
        if (err) {
            return console.error(err)
        }
        //accedo a la coleccion con parrots 
        db.collection('contenido').find({}).toArray(
            function (err, documents) {
                if (err) return console.error(err);
                if (documents.length == 0){
                    res.write('<head><meta charset="UTF-8"> <link rel="stylesheet" href="css/site.css"></head>');
                    res.write(`<body style="background: darkcyan" ALIGN=CENTER>
                  <h1 style="color:cyan">*****************************************************</h1>
                  <h1  style="color:cyan"> ERROR !!</h1>
                  <h1 style="color:cyan">No cuenta con ningun registro !!</h1></h1>
                  <h1 style="color:cyan">*****************************************************</h1>
                  <img SRC="../img/vacia.jpeg"></img>`);
                 res.write(`<div class="col-xs-offset-2 col-xs-10">
                        <input 
                        type="button" 
                        onclick=" location.href='http://127.0.0.1:3000' "
                        value="Regresar" 
                        name="boton"
                        class="btn btn-primary" />
                        </div>`);
                }  
                else {
                res.write(`<head>
                <meta charset="UTF-8">
                <link rel="stylesheet" href="css/site.css">
                </head>
                <body style="background: darkcyan">`);
                res.write(`<h1 ALIGN=CENTER style="color:cyan">***************************************************</h1>
                  <h1 ALIGN=CENTER style="color:cyan">LISTA DE CONDOMINOS REGISTRADOS</h1></h1>
                  <h1 ALIGN=CENTER style="color:cyan">***************************************************</h1>`);
                  //method="post" enctype="text/plain"
                    res.write('<P ALIGN=CENTER><table border="1"><thead><tr bgcolor="#5DADE2"><th>ID</th><th>Nombre</th><th>Apllido</th><th>Depto</th></tr></thead>');
                    for (i = 0; i < documents.length; i++) {
                        //var a = documents[i]._id, b = documents[i].Nombre, c=documents[i].Apellido,d=documents[i].Depto;
                        res.write('<tr style="color:white"><td>'+ documents[i]._id +' </td>' +
                            '<td>' + documents[i].Nombre + '</td>' +
                            '<td>' + documents[i].Apellido + '</td>' +
                            '<td>' + documents[i].Depto + '</td></tr>')
                            //`<td><input type="submit" class="btn btn-primary" value="Insertar"> </td></tr>`)
                    }
                    res.write('</p>')
                     res.write(`<p><div class="col-xs-offset-5 col-xs-10">
                        <input 
                        type="button" 
                        onclick=" location.href='http://127.0.0.1:3000' "
                        value="Regresar" 
                        name="boton"
                        class="btn btn-primary" />
                        </div></p>

                         <form 
                            action="/getremove"
                            method="POST"
                            style="padding-top: 10px;"
                            class="form-horizontal">
                        <label 
                                for="inputId"
                                class="control-label col-xs-2">
                                Selecciona un ID de la tabla para eliminar
                            </label>
                            <div class="col-xs-5">
                                <input 
                                required
                                class="form-control"
                                type="Password"
                                name="_id"
                                id="inputPassword"
                                placeholder="Ingrese ID"
                                maxlength="19">

                                 <input 
                                type="submit"
                                class="btn btn-primary"
                                value="Eliminar">
                            </div>`);
                }

                res.end();
                db.close()
            })
    })

}

var getremove = function (req, res) {
        if (req.method === "POST") {
                var postData = "";
       
        req.on("data", function (dataChunk) {
            postData += dataChunk;
        });
        req.on("end", function () {
            //rescatar los datos recibidos 
            //del cliente
            console.log(`>Data Received: ${postData}`.data);
            var data = querystring.parse(postData);
            //Replicar los datos recibidos
            res.writeHead(200, {
                'Content-Type': "text/html"
            });

            // var docs = data;
             mongo.connect(url, function (err, db) {
        if (err) {
            return console.error(err)
        }


            /* db.collection('contenido').find(data).toArray(
            function (err, documents) {
                if (err) return console.log(err);
                if (documents.length == 0)
                    res.write('no tienes ningun registro'+documents.length);
                })
                if(data==)*/
                /*if()
                 res.write(`<div class="col-xs-offset-2 col-xs-10">
                        <input 
                        type="button" 
                        onclick=" location.href='http://127.0.0.1:3000' "
                        value="Regresar" 
                        name="boton"
                        class="btn btn-primary" />
                        </div>`);
                }  
                else {*/
            //res.write(`<p> ${JSON.stringify(data)}</p>`);
            mongo.connect(url, function(err, db) {
                if (err) throw err
                var collection = db.collection('contenido')
                collection.remove(data, function(err) {
                    if (err){res.write('no se elimino nada')
                    }
                    db.close()
                })
                })
            res.end();
        
             })
      })      
    } 
}

//exportando Manejadores
var handlers = {};
handlers["/"] = getPostRoot;
handlers["/getauthorinfo"] = getAuthorInfo;
handlers["/getservername"] = getServerName;
handlers["/getservertime"] = getServerTime;
handlers["/getfind"] = getfind;
handlers["/getremove"] = getremove;
module.exports = handlers;