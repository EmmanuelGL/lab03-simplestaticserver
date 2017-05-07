module.exports={
"IP":process.env.IP || '0.0.0.0',
"PORT":process.env.PORT || 3000,
"color_theme":{
    "info":"rainbow",
    "data": "green",
    "error":"red",
    "warning":"yellow"
},
"STATIC_PATH":"./static",
"url": process.env.DB || "mongodb://127.0.0.1:27017/Condos" 

};
