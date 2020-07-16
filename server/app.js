const express = require('express');
const ProductData = require('./src/model/Productdata');
const RegisterData = require('./src/model/Registerdata')

const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

var app = new express();

app.use(cors());
app.use(bodyParser.json());

// TOKEN VERIFY

// function verifyToken(req,res,next){
//     if(!req.headers.authorization){
//         return res.status(401).send('Unauthorised request')
//     }
// let token = req.headers.authorization.split(' ')[1]
//     if(token === 'null') {
//         return res.status(401).send('Unauthorised request') 
// }
// let payload = jwt.verify(token, 'secretKey')
//     if(!payload) {
//         return res.status(401).send('Unauthorised request')
//     }
//     req.userId = payload.subject
//     next()
// }


app.get('/products',function(req,res){
    res.header("Access-Control-Allow-Origin", "*")
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    ProductData.find()
                .then(function(products){
                    res.send(products);
                });
});

app.post('/insert',function(req,res){
    res.header("Access-Control-Allow-Origin", "*")
    res.header('Access-Control-Allow-Methods:GET, POST, PATCH, PUT, DELETE, OPTIONS');
    console.log(req.body);
    var product = {
        productId : req.body.product.productId,
        productName : req.body.product.productName,
        productCode : req.body.product.productCode,
        releaseDate : req.body.product.releaseDate,
        description : req.body.product.description,
        price : req.body.product.price,
        starRating : req.body.product.starRating,
        imageUrl : req.body.product.imageUrl,
    }

    var product = new ProductData(product);
    product.save();

});

app.post('/edit',function(req,res){
    res.header("Access-Control-Allow-Origin", "*")
    res.header('Access-Control-Allow-Methods:GET, POST, PATCH, PUT, DELETE, OPTIONS');
    
    var product = {
        productId : req.body.product.productId,
        productName : req.body.product.productName,
        productCode : req.body.product.productCode,
        releaseDate : req.body.product.releaseDate,
        description : req.body.product.description,
        price : req.body.product.price,
        starRating : req.body.product.starRating,
        imageUrl : req.body.product.imageUrl,
    }

    console.log("data edited in server " +req.body.product._id);
    ProductData.updateOne(
        {_id:req.body.product._id},{$set:product},
        function(err,res)
        {
            if(err){console.log(err)}
        }
    )

});


app.delete('/delete/:id',function(req,res){
        res.header("Access-Control-Allow-Origin", "*")
        res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');

        console.log(req.params.id)
        ProductData.findByIdAndDelete(req.params.id,(err,doc)=>{
            if (err){console.log("Error")}
        })
    })

// register & login

app.post('/register',(req,res)=>{
    let userData = req.body;
    let user = new RegisterData(userData)
    user.save((err,registeredUser) =>{
        if (err) {
            console.log(err)
        }
        else{
            let payload = {subject: user._id}
            let token = jwt.sign(payload, 'secretKey')
            res.status(200).send({token})

            // res.status(200).send(registeredUser)
        }
    })
})

app.post('/login',(req,res)=>{
    let userData = req.body
    RegisterData.findOne({email:userData.email},(err,user)=>{
        if(err){
            console.log(err)
        }
        else{
            if(!user){
                res.status(401).send('Invalid email')
            }
            else
            if(user.password!==userData.password){
                res.status(401).send('Invalid password')
            }
            else{
                let payload = {subject: user._id}
                let token = jwt.sign(payload, 'secretKey')
                res.status(200).send({token})

                // res.status(200).send(user)
            }
        }
    })
})


app.get('/',function(req,res){
    res.send("Hello world");
});

app.listen(3000,function(){
    console.log('listening to port 3000');
});