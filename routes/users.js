const express  = require('express');
var bcrypt = require('bcrypt-nodejs');

const router=express.Router();
const admin=require('../config.js')
const db=admin.firestore();
const userCollection=db.collection("users");

router.get('/users',(req,res)=>{
let allUsers=[];
userCollection.get().then(snapshot=>{
    snapshot.forEach(doc=>{
        allUsers.push(
            {
                "docId":doc.id,
                "docData":doc.data()
            }
        );
    });
    res.json({
        "statusCode":"200",
        "statusResponse":"OK",
        "message":"all users",
        "data":allUsers

    });
}).catch(err=>{
    console.log('Error geting document');
    res.json({
        "statusCode":"404",
        "statusResponse":"not found",
        "message":"Not users",

    });
});
});

router.get('/users/:id',(req,res)=>{
    userCollection.doc(id).get().then(
        doc=>{
            if(doc.exists){
                res.json({
                    "statusCode":"200",
                    "statusResponse":"OK",
                    "message":"user",
                    "data":doc.data()
            
                });
            }
            else{
                res.json({
                    "statusCode":"400",
                    "statusResponse":"not found",
                    "message":"user not found"
                });
            }
        
    }).catch(err=>{
        console.log(err);
    });
    });

    router.post('/users',(req,res)=>{
        if(req.body.name && req.body.email && req.body.pass){
            let newUser={
                "name":req.body.name,
                "email":req.body.email,
                "pass":bcrypt.hashSync(req.body.pass, null, null)
            };
            userCollection.doc(req.body.email).set(newUser).then(v=>{
                res.json({"message":"user add"}); 
            }).catch(err=>{
                console.log(err);
                res.json({'message':err}); 
            });
        }
        else{
            res.json({'message':"inconrrec params","params":"(name,email,pass)"}); 
        }
            
        });

module.exports=router;