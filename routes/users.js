const router = require("express").Router();
const User = require("../models/User")
const bcrypt = require("bcrypt")
//update user
router.put("/:id", async(req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }catch(err){
                return res.status(403).json(err)
            }
        }
        try{
            const user =await User.findByIdAndUpdate(req.params.id,{
                $set:req.body,
            });
            res.status(200).json("Account has been updated ")
        }catch(err){
            return res.status(500).json(err)
        }
    }else{
        return res.status(403).json("you can update onli your account!")
    }
    
        
    }
)
//delete user

router.delete("/:id", async(req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        /* if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }catch(err){
                return res.status(403).json(err)
            }
        } */ //삭제에서는 암호 프로세스가 필요하지 않음
        try{
            const user =await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted ")
        }catch(err){
            return res.status(500).json(err)
        }
    }else{
        return res.status(403).json("you can delete onli your account!")
    }
    
        
    }
)
//get a user
router.get("/:id", async (req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        const {password,updatedAt,...other } = user._doc
        res.status(200).json(other)
    }catch(err){
        res.status(500).json(err)
    }
}) //findById  메서드를 사용 하여 데이터 베이스에서 사용자를 찾음
    //password,updatedAt  필드를 제외한 모든 필드를 봉안 이슈를 방지하기위해 other 변수에 저장함



//follow a user

router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) { //사용자가 팔로우 하기위해 팔로우 하는 아이디 값을 비교함 
      try {
        const user = await User.findById(req.params.id);//요청 파라미터의 id 값을 가진 사용자를 조회함
        const currentUser = await User.findById(req.body.userId);//userid 값을 가진 현재 사용자를 조회
        if (!user.followers.includes(req.body.userId)) {//해당 사용자가 이미 해당 사용자를 팔로우 하고 있는지 없는지 확인함
          await user.updateOne({ $push: { followers: req.body.userId } });//조회한 사용자의 followers 배열에 현재 사용자의 id 값을 추가함
          await currentUser.updateOne({ $push: { followings: req.params.id } });//현재 사용자의 followings 배열에 조회한 사용자의 id 값을 추가함
          res.status(200).json("user has been followed");
        } else {
          res.status(403).json("you allready follow this user");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("you cant follow yourself");
    }
  });
//unfollow a user
router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
        if (user.followers.includes(req.body.userId)) {
            await user.updateOne({ $pull: { followers: req.body.userId } });
            await currentUser.updateOne({ $pull: { followings: req.params.id } });
            res.status(200).json("user has been unfollowed");
        } else {
            res.status(403).json("you dont follow this user");
        }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
      res.status(403).json("you cant unfollow yourself");
    }
  });

module.exports = router