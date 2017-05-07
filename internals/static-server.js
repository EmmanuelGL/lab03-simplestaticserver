//Funcionalidad de servidor estatico
//cargando dependencias
var fs=require('fs'),
    mime=require('mime'),
    path=require('path'),
    colors=require('colors'),
    config=require('../Config/config');
//Exportando funcionalidades dependencias
//servidor estatico
exports.serve=function(req, res){
    //variable que almacenara la ruta absoluta
// del archivo hacer servidor 
var resourcePath;
    if(req.url=="/"){
        //el cliente no especifica
        //recurso
        resourcePath=path.resolve('./static/index.html');
       
    }  else{
    //obteniendo la ruta 
    //absoluta del recurso que se desea 
    //servidor 
      resourcePath =
      path.resolve(config.STATIC_PATH + req.url);//de ruta relativa a ruta absoluta 
     
 }
      console.log(`> Recurso solicitado: ${resourcePath}`.data);
     //Extrayendo la extension de la url solicitada 
    var extName= path.extname(resourcePath);

    //crear la variable content-type
    var contentType = mime.lookup(extName);
    //todo: verificar la existencia del recurso
    fs.exists(resourcePath, function(exists){
        if(exists){
            console.log('> El recurso existe...'.info);
            //El recurso existe y se intentara leer
                fs.readFile(resourcePath,function(err,content){
                        //Verifico si hubo un error en la lectura del archivo
                        if(err){
                                console.log('>Error en lectura de recurso'.error);
                                //hubo un error de lectura
                                res.writeHead(500,{
                                    'content-Type':'text/html'
                                });
                                res.end('<body background="../img/error.jpg"><h1>500: Error interno</h1></body>');
                        }else{
                                console.log(`>se despacha recurso: ${resourcePath}`.info);
                                //No hubo error
                                res.writeHead(200,{
                                'content-Type': contentType,
                                'Server': 'ITGAM@0.0.1'
                            });
                           
                         res.end(content,'utf-8');                   
                            
                        }
                    });
            
        }else{
                console.log('>El recurso solicitado no fue encontrado......'.info);
                //El recurso no existe
            res.writeHead(404,{
                    'content-Type': 'text/html',
                    'Server': 'ITGAM@0.0.1'});
                    res.end('<body background="../img/error.jpg"> <h1>404:Not Found</h1> </body>');
        }

    });
}
