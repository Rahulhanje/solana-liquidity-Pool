import dotenv from 'dotenv';
dotenv.config();
import express from 'express'
import { mintTokens } from './src/mintTokens.js';


const app=express();
app.use(express.json());


const HELIUS_RESPONSE = {
    "nativeTransfers": [ { 
       "amount": 10000000, 
       "fromUserAccount": "7qE3FJYpsH4LbYWLSohxY4WxKW2XVgJ5yZ4GNfLwFKvE", 
       "toUserAccount": "8pyAjXonZuD2zjj1Wt6VUYUNgfisdzhrFJZDoF7WkmAC" 
   } ] }
   
const VAULT = "8pyAjXonZuD2zjj1Wt6VUYUNgfisdzhrFJZDoF7WkmAC";
app.post('/helius',async(req,res)=>{
   const heliustxn=HELIUS_RESPONSE.nativeTransfers.find(x=>x.toUserAccount==VAULT)
   if(!heliustxn){
    res.json({message:"Processed"});
   }
   const fromAddress=heliustxn.fromUserAccount;
   const toAccount=heliustxn.toUserAccount;
   const amount=heliustxn.amount;
   const type='received_native_sol';
   await mintTokens(toAccount,fromAddress,amount);
   res.json({message:"Transation succesfull"})
});

app.listen(3000);