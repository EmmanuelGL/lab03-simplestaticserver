//cargar el modulo http
var http= require('http');
//cargar el modulo fs
var fs=require('fs');
//cargar el modulo Path
var path = require('path');
//cargando colors
var colors= require('colors');

//cargando el modulo mime
var mime = require('mime');

//--cargando configuraciones
var config = require("./Config/config.js");
//importando los handlers
var handlers=require('./internals/handlers');
//IMPORTO LA FUNCIONALIDAD DEL SERVIDOR ESTATICO
var staticServer= require('./internals/static-server');

//establecer el tema de colors
colors.setTheme(config.color_theme);


//creando el server
var server =http.createServer(function(req, res){
    //logeando la peticion
    console.log(`> Peticion entrante: ${req.url}`.data);


    //verificando si la url corresponde 
    //a un comando de mi API
    if(typeof(handlers[req.url])=='function'){
        //Existe el manejador en mi API
        //Entonces mando a ejecutar el
        // manejador con los parametros que pide 
        handlers[req.url](req,res);
    }else{
        //Noexiste el manejador en mi 
        //API
        //entonces intento servir la url
        //como un recurso ESTATICO
        staticServer.serve(req,res);
    }
});
//Poniendo en ejecucion el server
server.listen(config.PORT,config.IP,function(){
    console.log(
        `>Server escuchando en http://${config.IP}:${config.PORT}`.info);
});