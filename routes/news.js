const express  = require('express');
const router=express.Router();

const admin=require('../config.js')
const db=admin.firestore();
const newCollection=db.collection("news");

router.get('/news',(req,res)=>{
    let all=[];
    newCollection.get().then(snapshot=>{
        snapshot.forEach(doc=>{
            all.push(
                {
                    "id":doc.id,
                    "data":doc.data()
                }
            );
        });
        res.json({
            "statusCode":"200",
            "statusResponse":"OK",
            "message":"all news",
            "data":all
    
        });
    }).catch(err=>{
        console.log('Error geting document');
        res.json({
            "statusCode":"404",
            "statusResponse":"not found",
            "message":"Not news",
    
        });
    });
    });
    router.get('/news/:Id',(req,res)=>{
        newCollection.doc(req.params.Id).get().then(v=>{

                res.json({"new":v.data()}); 
            }).catch(err=>{
                console.log(err);
                res.json({'message':err}); 
            });
          
    });
    router.post('/news',(req,res)=>{
        if(req.body.userId && req.body.description && req.body.title){
            let newNew={
                "description":req.body.description,
                "images":req.body.images,
                "user":req.body.userId,
                "title":req.body.title,
                "date":new Date
            };
            newCollection.add(newNew).then(v=>{
                res.json({"message":"new add","id":v.id}); 
            }).catch(err=>{
                console.log(err);
                res.json({'message':err}); 
            });
        }
        else{
            res.json({'message':"inconrrec params","params":"(description,images,user,title)"}); 
        }
            
    });
    module.exports=router;