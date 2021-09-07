const User = require("../models/userModel");

const bcrypt = require("bcrypt");

exports.signUp = async (req, res) => {
    const {username, password} = req.body

    // console.log(hashpassword);
    // console.log(password);
    try {
        const hashpassword = await bcrypt.hash(password, 12)
        const newUser= await User.create({
            username,
            password: hashpassword
        });
        req.session.user = newUser;
        res.status(201).json({
            status: 'success',
            data: {
                user: newUser
            },
        });
    } catch (e) {
        res.status(400).json({
            status: "failed"
        });
    }
};

exports.login = async (req, res) => {
    const {username, password} = req.body;
    try {
    const user = await User.findOne({username})
        console.log(user)
    if (!user) {
       return res.status(400).json({
            status: 'Failed', 
            message: 'User not found'
        })
    }
    const isCorrect = bcrypt.compare(password, user.password)

    if(isCorrect) {
        req.session.user = user;
        res.status(200).json({
            status: 'success'
        });
    } else{
        res.status(400).json({
            status: 'fail',
            message: 'Incorrect username or password'
        });
      }
    } catch (e) {
        res.status(400).json({
            status: "failed"
        });
    }
} 