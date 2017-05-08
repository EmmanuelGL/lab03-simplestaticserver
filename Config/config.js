module.exports={
"IP":process.env.IP,
"PORT":process.env.PORT,
"color_theme":{
    "info":"rainbow",
    "data": "green",
    "error":"red",
    "warning":"yellow"
},
"STATIC_PATH":"./static",
"url": process.env.DB || "mongodb://127.0.0.1:27017/Condos" 

};
