const{resolve:resolve}=require("path"),fs=require("fs"),logger=require("morgan"),Datastore=require("nedb"),express=require("express"),rateLimit=require("express-rate-limit"),limiter=rateLimit({windowMs:66e4,max:100}),apiLimiter=rateLimit({windowMs:9e5,max:100}),app=express();var db=new Datastore({filename:resolve(__dirname,"../db/db")});db.loadDatabase(),app.use(logger("dev")),app.use(express.json({limit:"6mb",extended:!0})),app.use(express.urlencoded({limit:"5mb",extended:!0})),app.use("/api/",apiLimiter);var publicc=resolve(__dirname,"../public");app.get("/",limiter,(e,t)=>{t.sendFile(resolve(publicc,"index.html"))}),app.get("/map/two",limiter,(e,t)=>{t.sendFile(resolve(publicc,"./map/map.html"))}),app.get("/logs",limiter,(e,t)=>{t.sendFile(resolve(publicc,"logs/index.html"))}),app.get("/map",limiter,(e,t)=>{t.sendFile(resolve(publicc,"./map/index.html"))}),app.get("/api/status",(e,t)=>{const s={uptime:process.uptime(),message:"Ok",date:(new Date).getTime()/1e3};try{t.status(200).send(s)}catch(e){t.status(500).send(e)}}),app.get("/api",(e,t)=>{db.find({},function(e,s){if(e)return t.status(400).send(e);t.json(s)})}),app.get("/api/lines",(e,t)=>{db.find({},function(e,s){if(e)return e;var r=s.length+1;t.json({length:r})})}),app.get("/api/count",(e,t)=>{var s=e.query.term||e.query.id;db.count({_id:s},function(e,s){e&&t.status(400).send(e),t.json(s)})}),app.post("/api",(e,t)=>{const s=(new Date).getTime();if(e.body.toString().includes("proto"))return void t.status(400).send("includes proto which is restricted");if(e.body.toString().includes("constructor.prototype"))return void t.status(400).send("includes constructor.prototype which is restricted");const r=Object.assign({created:s},e.body);db.insert(r,(e,s)=>{if(e)return e;t.json(s)})}),app.delete("/api/one",(e,t)=>{var{id:s}=e.query,{authorization:r}=e.headers;return r?(r=r.split(" ")[1])!==process.env.pass?t.status(401).json({error:"auth doesn't match"}):void db.remove({_id:s},{multi:!0},function(e,r){return e?t.status(400).json({error:e}):0==r?t.status(400).json({error:"id unknow"}):void t.send({removedn:r,id:s})}):t.status(401).json({error:"No credentials sent!"})}),app.get("/vip",limiter,(e,t)=>{if(e.headers.authorization!==process.env.pass)return t.status(401).send("401");require("./vip")(e,t)}),module.exports=app;