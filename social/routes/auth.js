const router = require("express").Router();
const User= require("../models/User")
const bcrypt = require("bcrypt")//패스워드를 암호화 하기위한 라이브러리

//REGISTER
//인증관리
router.post("/register", async (req,res)=>{
    //새 비밀번호를 입력
    try{
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)//패스워드 암호화

        //새 사용자를 생성
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });
        //사용자를 저장하거나 응답
        const user = await newUser.save();
        res.status(200).json(user)
    } catch(err){
        res.status(500).json(err)
    }
   
})

//로그인

router.post("/login", async(req,res)=>{
    try{
        //이메일이 인증
        const user = await User.findOne({email:req.body.email}) //하나의 이메일을 찾음
        !user && res.status(404).json("user not found") //이메일이 없으면 404
        //비밀번호 인증
        const validPassword = await bcrypt.compare(req.body.password, user.password)//비밀번호를 찾는 코드
        !validPassword && res.status(400).json("wrong password")//잘못된 비밀번호
        
        res.status(200).json(user) //로그인 성공
    } catch(err){
        res.status(500).json(err)
    }
    
})
module.exports = router