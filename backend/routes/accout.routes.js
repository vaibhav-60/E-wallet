import {Router} from 'express'
import { Account } from '../model/user.model.js'
import {authMiddleware} from '../middleware/auth.middle.js'
import mongoose from 'mongoose'


const router = Router()

router.get('/balance', authMiddleware, async(req, res) =>{
    const userId = req.userId

    const account = await Account.findOne({
        userId: userId
    })

    // console.log(account)
    if(!account){
        return res.status(404).json({message: 'Account not found'})
    }

    return res.status(200).json({
        balance: account.balance,
        message: "Balance Successfully fetched"
    })


})
  // /..............................Transfer route ............................................//
router.post('/transfer', authMiddleware, async (req, res) => {

    try {
        const session = await mongoose.startSession();
    
        session.startTransaction();
    
        const {amount, to } = req.body;
    
        //Fetch the account within the transaction
    
        const account = await Account.findOne({
            userId: req.userId
        }).session(session)
    
    
        //check whether the account is exsiting or not
        //and account has enough money or not
    
        if(!account || account.balance <amount){
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient funds"
            })
        }
    
        // now we would like to find the account whome we want to send money
    
        const toAccount = await Account.findOne({
            userId: to
        }).session(session)
    
        // check whether the recipient account is exsiting or not
    
        if (!toAccount){
            await session.abortTransaction();
    
            return res.status(400).json({
                message: "Invalid recipient account"
            })
        }
    
        //perform the transfer
    
        await Account.updateOne({userId: req.userId}, {
            $inc: {balance: -amount}
        })
    
        await Account.updateOne({userId : to}, {
            $inc: {balance: amount}
        })
        
    
        //now commit the transaction
    
        await session.commitTransaction();
    
        return res.status(200).json({
            message: "Transfer Successful"
        })
        
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            message: "Something went wrong",
            error: error
        })
    }

})

export default router;