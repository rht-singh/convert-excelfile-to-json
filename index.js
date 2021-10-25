const express = require('express');
const cluster = require('cluster');
const os = require('os');
const dotenv = require('dotenv').config()
const file_upload = require('express-fileupload');
const swagger = require('swagger-ui-express');
const cors = require('cors')
const routing = require('./controller/main');
const YAML = require('yamljs');
const swagger_doc = YAML.load('./api.yaml');
require('./database/db');
const busboy = require('connect-busboy');
const busboyBodyParser = require('busboy-body-parser');

const app = express();
let port = process.env.port || 3000;

//middle ware 
app.use(express.static('./files'))
app.use(cors());
app.use('/api_doc',swagger.serve,swagger.setup(swagger_doc));
app.use(file_upload({
    abortOnLimit:true,
    createParentPath:true
    
}))

app.use(busboy());
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(busboyBodyParser());
app.use('/api/v1',routing);

if(cluster.isMaster){
    for(let i=0;i<os.cpus().length;i++){
        cluster.fork()

    }
    cluster.on('end',()=>{
        cluster.fork()
    })
}
else{
    app.listen(port,()=>{
        console.log('server stared with port '+port);
    })
}