const express=require("express");
const {exec}=require("child_process");
const ejs=require("ejs");
const path=require("path");
const { error } = require("console");
const { report } = require("process");
const { spawn } = require('child_process');
const app=express();


const { clearScreenDown } = require("readline");
const static_path=path.join(__dirname,"../public");
const template_path=path.join(__dirname,"../templates/views");
app.use(express.static(static_path));

app.use(express.json());

app.use(express.urlencoded({extended:true}));
app.set("view engine",'ejs');
app.set("views",template_path); 


app.get('/',(req,res)=>{
     res.render("home")  
})

app.get('/scanner',(req,res)=>{
    res.render("scanner");
});



app.post('/scan',(req,res)=>{
    const { stype, target, mport } = req.body;
    let args = [stype];
    
    // Add mport only if it's provided
    if (mport) {
        args.push(mport);
    }

    args.push(target);
    if(target==""){
        res.redirect("scanner");
    }else{
        const nmap = spawn('nmap', args);

        let output = '';

        nmap.stdout.on('data', (data) => {
            output += data.toString();
        });
        
        nmap.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
            res.send(`
                <link rel="stylesheet" href="homes.css">
                    <link rel="shortcut icon" href="pics/scanvectorfavicon.jpg" type="image/x-icon">
                            <style>
                               
                                    #goback{
                                        margin-top: 4cm;
                                        margin-right: 3cm;
                                        font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
                                        font-size: 23px;
                                        height: 1.2cm;
                                        width: 7cm;
                                        background-color: #fff;
                                        border-radius: 5px;
                                        border-style: solid;
                                        color: #0050da;
                                        border-color: #0050da;
                                    }
                                    
                                    
                                    #goback:hover{
                                        border-style: solid;
                                        border-color: #0050da;
                                        color: #0050da;
                                        cursor: pointer; 
                                        border-radius: 0.3cm;
                                        transition: 700ms;
                                        background-color: #fff;
                                    }
                             
                            </style>
                
                
                <div style="padding-left:3cm">
                                <h1 style="color:#0050da; font-size:2cm">The scan report :-</h1>
                                <h1 style="color:red">${data}</h1><br><br>
                                <form action="/scanner" method="get">
                                    <button type="submit" id="goback">go back</button> 
                                </form>
                    </div>`);
        });
        let report='';
        nmap.on('close', (code) => {
            if (code !== 0) {
                res.status(500).send('An error occurred, sorry.');
            } else {
                report = `<pre>${output}</pre>`;
                res.send(`
                    <link rel="stylesheet" href="homes.css">
                    <link rel="shortcut icon" href="pics/scanvectorfavicon.jpg" type="image/x-icon">
                            <style>
                               
                                    #goback{
                                        margin-top: 4cm;
                                        margin-right: 3cm;
                                        font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
                                        font-size: 23px;
                                        height: 1.2cm;
                                        width: 7cm;
                                        background-color: #fff;
                                        border-radius: 5px;
                                        border-style: solid;
                                        color: #0050da;
                                        border-color: #0050da;
                                    }
                                    
                                    
                                    #goback:hover{
                                        border-style: solid;
                                        border-color: #0050da;
                                        color: #0050da;
                                        cursor: pointer; 
                                        border-radius: 0.3cm;
                                        transition: 700ms;
                                        background-color: #fff;
                                    }
                             
                            </style>
                            <div style="padding-left:3cm">
                                <h1 style="color:#0050da; font-size:2cm">The scan report :-</h1>
                                <h1 style="color:red">${report}</h1><br><br>
                                <form action="/scanner" method="get">
                                    <button type="submit" id="goback">go back</button> 
                                </form>
                            </div>`);
            }
        });
        
    }
    
})




app.listen(3000,()=>{
    console.log(`server running at http://localhost:3000/`);
})