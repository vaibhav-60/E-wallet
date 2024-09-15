import {Router} from 'express'
import zod from 'zod'
import {User, Account} from '../model/user.model.js'
import jwt from 'jsonwebtoken'
import {authMiddleware} from '../middleware/auth.middle.js'


const router = Router()


//validation via zod
const signupBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string()
})



router.post('/signup', async (req,res) => {
    // console.log('Request Body:', req.body);
    const {success} = signupBody.safeParse(req.body)
    // console.log('Validation Success:', success);

    // console.log(success)
    if(!success){
        return res.status(411).json({
            message: " Incorrect inputs"
        })
    }

    const existingUser = await User.findOne({
        username: req.body.username
    })

    if(existingUser){
        return res.status(411).json({
            message: "Email already taken "
        })
    }
    //pushing into db
    const user = await User.create({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password 
    })
    // console.log(user);

    const userId =user._id

    //............................create new account ..............................


    await Account.create({
        userId: userId,
        balance:  1 + Math.random() * 10000
    })
//token generataion
//jwt.sign(payload, secretKey, options)

    const token = jwt.sign({
        userId,
    }, process.env.JWT_SECRET)

    res.status(200).json({
        message: "User created successfully",
        token: token
    })
})

//--------------------------route for signin
//zod 

const signinBody =zod.object({
    username: zod.string().email(),
    password: zod.string()
})
// we only need to send the username and password and will get new token
 router.post('/signin', async (req, res) => {
    const success = signinBody.safeParse(req.body)
    if (!success){
        return res.status(404).json({
            message: "Invalid email or password"
        })
    }
    //here we are getting back the data stored in db
    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    })
    //here we check the user exists or not if yes give it token
    // if (user){
    //     const token = jwt.sign({
    //         userId: user._id
    //     }, process.env.JWT_SECRET)

    //     return;
    // }

    if(!user){
        return res.status(411).json({
            message: "Invalid email or password"
        })
    }

    //generate the token and return to the response
    const token = jwt.sign({
        userId: user._id
    },  process.env.JWT_SECRET)

    return res.status(200).json({
        message: "Logged in successfully",
        token: token
    })
})


// .............................rout to update the user details.............

//zod auth

const updarteBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put('/', authMiddleware, async (req, res) => {

    const {success} = updarteBody.safeParse(req.body)

    // check if the is sending the data properly

    if (!success){
        return res.status(404).json({
            message: "Invalid inputs"
        })
    }

    // find the user based on the token
    const user = await User.findByIdAndUpdate(req.userId, req.body, {new: true})

    if (!user){
        return res.status(404).json({
            message: "User not found"
        })
    }

    return res.status(200).json({
        message: "User updated successfully",
        user
    })

})


// ....................................Route to get users from the backend, filterable via firstName/lastName.................


router.get('/bulk', async (req, res) => {

    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter // this is an operator in the mongoose used to filter out on partial name mathcing eg: su :- sudhanshu, subham sumit rtc will be poped up
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })

    
})


export default router;