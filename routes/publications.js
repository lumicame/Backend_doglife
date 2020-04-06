const express  = require('express');
const router=express.Router();

const admin=require('../config.js')
const db=admin.firestore();
const publicationCollection=db.collection("publications");

router.get('/publications',(req,res)=>{
    let all=[];
    publicationCollection.get().then(snapshot=>{
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
            "message":"all publications",
            "data":all
    
        });
    }).catch(err=>{
        console.log('Error geting document');
        res.json({
            "statusCode":"404",
            "statusResponse":"not found",
            "message":"Not publications",
    
        });
    });
    });

    router.post('/publications',(req,res)=>{
        if(req.body.userId){
            let newPublication={
                "description":req.body.description,
                "images":req.body.images,
                "user":req.body.userId,
                "date":new Date
            };
            publicationCollection.add(newPublication).then(v=>{
                res.json({"message":"publication add","id":v.id}); 
            }).catch(err=>{
                console.log(err);
                res.json({'message':err}); 
            });
        }
        else{
            res.json({'message':"inconrrec params","params":"(description,images,user)"}); 
        }
            
    });
    router.get('/publications/comment/count/:Id',(req,res)=>{
        
        publicationCollection.doc(req.params.Id).collection('comments').get().then(v=>{
            res.json({"count":v.size}); 
        }).catch(err=>{
            console.log(err);
            res.json({'message':err}); 
        });
      
});
    router.get('/publications/comment/:Id',(req,res)=>{
        let comments=[];
            publicationCollection.doc(req.params.Id).collection('comments').get().then(v=>{
                v.forEach(e=>{
                    comments.push(
                        {
                            "id":e.id,
                            "data":e.data()
                        }
                    );
                });
                res.json({"count":v.size,"comments":comments}); 
            }).catch(err=>{
                console.log(err);
                res.json({'message':err}); 
            });
          
    });
    router.post('/publications/comment/:Id',(req,res)=>{
        if(req.body.userId){
            let newComment={
                "description":req.body.description,
                "user":req.body.userId,
                "date":new Date
            };
            publicationCollection.doc(req.params.Id).collection('comments').add(newComment).then(v=>{
                res.json({"message":"comment add","id":v.id}); 
            }).catch(err=>{
                console.log(err);
                res.json({'message':err}); 
            });
        }
        else{
            res.json({'message':"inconrrec params","params":"(description,images,user)"}); 
        }
            
    });

    router.get('/publications/like/count/:Id',(req,res)=>{
        var state=false;
        publicationCollection.doc(req.params.Id).collection('likes').get().then(v=>{
            v.forEach(e=>{
                if(req.body.userId==e.id)
                state=true;
            });
            res.json({"count":v.size,"state":state}); 
        }).catch(err=>{
            console.log(err);
            res.json({'message':err}); 
        });
      
});

    router.post('/publications/like/:id',(req,res)=>{
        if(req.body.userId){
            let newLike={
                "user":req.body.userId,
            };
            publicationCollection.doc(req.params.id).collection('likes').doc(req.body.userId).set(newLike).then(v=>{
                res.json({"message":"like add","id":v.id}); 
            }).catch(err=>{
                console.log(err);
                res.json({'message':err}); 
            });
        }
        else{
            res.json({'message':"inconrrec params","params":"(description,images,user)"}); 
        }
            
    });
    router.post('/publications/dislike/:id',(req,res)=>{
        if(req.body.userId){
            
            publicationCollection.doc(req.params.id).collection('likes').doc(req.body.userId).delete().then(v=>{
                res.json({"message":"like add","id":v.id}); 
            }).catch(err=>{
                console.log(err);
                res.json({'message':err}); 
            });
        }
        else{
            res.json({'message':"inconrrec params","params":"(description,images,user)"}); 
        }
            
    });
    module.exports=router;