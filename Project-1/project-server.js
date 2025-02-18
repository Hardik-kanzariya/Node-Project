const http = require('http');
const fs = require('fs');

const requesthandler = (req, res) =>{
    console.log(req.url);
    let fileName = ""
    switch (req.url) {
        case "/": 
        fileName = "./home.html";
            break;
    
        case "/about" : 
        fileName = "./about.html";
        break;
        case "/contact" : 
        fileName = "./contact.html";
        break;
    }

    fs.readFile(fileName, (err, result) =>{
        if (err) {
            console.log(err);
        }
        else{
            res.end(result);
        }
    })
    
}


const server = http.createServer(requesthandler)
const port = 8000;

server.listen(port , ()=>{
    console.log(`server Stared at http://localhost:${port}`);
});

