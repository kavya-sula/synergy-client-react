const express=require("express");
const app=express();
const mongoose=require("mongoose");
const bcrpyt = require('bcrypt')
const jwt=require("jsonwebtoken")
const middleware=require("./middleware/jwtAuth") 
const cors=require("cors")
const userlist= require("./models/userDetails")
const User=require("./signup")
const Song=require("./models/Song")
app.use(express.json());
app.use(cors());

mongoose.connect(`mongodb+srv://sulakavya:kavya08@cluster0.libvzp7.mongodb.net/SampleExpress?retryWrites=true&w=majority&appName=Cluster0`)

.then(() =>
{
    console.log("DB connected.....")
}).catch((err) =>{
    console.log(err)
});
const port=4445;
app.get("/name",(req,res) => {
    res.send("sulakavya.com")
});
// add content 
app.post("/send-video-details",async(req,res)=>{
    try{
        const sendvideoDetails=await Song.create(req.body);
        return res.status(201).json({message :"video details saved sucessfully",sendvideoDetails});
        // res.status(200).json({ message: 'Song created successfully' });

    }catch(error){
console.log(error);
    }
})
//update the user
app.put("/update-user", async (req, res)=>{
    try {
        let individual = await userlist.findOne({email: req.body.email})
        if(!individual){
            return res.status(400).send("user not found")
        }
        individual.age=req.body.age;
        individual.userName=req.body.userName;
        const updateuser= individual.save();
        res.send("user updated sucessfully")
    } catch (e) {
        console.log(e);
        
    }

})

// //delete the user

// // app.delete("/delete-user/:email", async (req, res)=>{
// //     try {
// //         let deletingUser = await userlist.findOne({email: req.params.email})
// //         if(!deletingUser){
// //             return res.status(400).send("the user trying to delete not exist")
// //         }
        
// //         const deletedUser= await userlist.findByIdAndDelete({email: req.params.email})
// //         res.send("user deleted sucessfully")
// //     } catch (e) {
// //         console.log(e);
        
// //     }

// // })

// // app.delete("/delete-user/:email", async (req, res) => {
// //   try {
// //     const deletingUser = await userslist.findOne({ email: req.params.email });
// //     if (!deletingUser) {
// //       return res.status(400).send('The User You are trying to Delete does not Exist');
// //     }
// //     const deletedUser = await userslist.findOneAndDelete({email : req.params.email});
// //     res.send("user deleted successfully")
    
// //   } catch (error) {
// //     console.log(error);
// //   }
// // })

app.post("/signup",async(req,res)=>{
    try {

        const { email, password } =req.body;
        
        const checkUser =await User.findOne({email: email});
        
        if (checkUser) {
        
        return res.status(404).json({ message: "user already exists"}); }
        
        if (req.body.password !== req.body.confirmpassword) {
        
        return res.status(404).json({message: "passwords doesnot match"});
        }
        
        const hashedPassword = await bcrpyt.hash(password, 10);
        
        req.body.password =hashedPassword;
        
        console.log("hello", password);
        
        const newUser = new User(req.body);
        
        await newUser.save();
        
        res.status(200).json({ message: "user signedup successfully"});
    }
        
        catch (error) {
        
        console.log(error);
}
});



app.post('/login', async (req, res) => {

    try {
    
    const {email, password}= req.body;
    
    const userExist= await User.findOne({email: email });
    
    if (!userExist) {
    
    return res.status(406).json('User doesnot exist');
    }
    
    const passwordMatched =await bcrpyt.compare(password, userExist.password);
     if (!passwordMatched) {
    
    return res.status(401).send('invalid password')
 }
    
    const token = jwt.sign({mail: userExist.email}, "secretToken", {expiresIn: "1hr"});
     res.status(200).json({token, message: "loggedin successfully"})
    
  }   catch (error){
    
    console.log(error);
    
    }
})
// app.post('/songs', async (req, res) => {
//     try {
//       const { songName, category, views, publisheddate, subscribers, channelname } = req.body;
//       const newSong = new Song({
//         songName: songName,
//         category: category,
//         views: views,
//         publisheddate: publisheddate,
//         subscribers: subscribers,
//         channelname: channelname
//       });
//       await newSong.save();
//       res.status(200).json({ message: 'Song created successfully' });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   });
//   app.get('/song', async (req, res) => {
//     try {
//       const songs = await Song.find(); // Retrieve all songs from the database
//       res.status(200).json(songs); // Send the songs as JSON response
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   });

app.post("/send-video-details", async(req,res)=>{
  try{
      const sendvideoDetails=await Song.create(req.body);
      return res.status(201).json({message :"video details saved sucessfully",sendvideoDetails});
      // res.status(200).json({ message: 'Song created successfully' });
      
  }catch(error){
console.log(error);
}
})

app.get("/video-details" , async (req,res) =>{
    try{
        const videos= await Song.find({});
        res.status(200).json(videos);
    }
    catch(error){
        console.log(error);
    }

})
// api to get individual data
app.get("/individualvideo/:id", async (req, res) => {
    try {
      // const id = req.params.id;
      const { id } = req.params;
      const video = await Song.findById({ _id: id });
      res.status(200).json(video);
  
    } catch (error) {
      console.log(error);
    }
  })
  
// api to get trending videos
app.get("/trendingvideos", async (req, res) => {
    try {
      const trendingVideos = await Song.find({ category: "Trending" });
      return res.status(200).json({ trendingVideos: trendingVideos });
    } catch (error) {
      console.log(error);
    }
  });

  // api to get gaming videosserver/server.js
app.get("/gamingvideos", async (req, res) => {
    try {
      const gamingVideos = await Song.find({ category: "Gaming" });
      return res.status(200).json({ gamingVideos: gamingVideos });
    } catch (error) {
      console.log(error);
    }
  });
  app.get("/cartoonvideos", async (req, res) => {
    try {
      const cartoonVideos = await Song.find({ category: "Cartoon" });
      return res.status(200).json({ cartoonVideos: cartoonVideos });
    } catch (error) {
      console.log(error);
    }
  });
  app.get("/savedvideos", async (req, res) => {
    try {
      const savedVideos = await Song.find({ savedStatus: "Saved" });
      return res.status(200).json({ savedVideos: savedVideos });
    } catch (error) {
      console.log(error);
    }
  });
  
  // api to update the saved status
  app.put("/videos/:id/save", async (req, res) => {
  
    const { id } = req.params;
    console.log(id);
    const { savedStatus } = req.body;
    console.log(savedStatus);
    try {
      const updatedVideo = await Song.findByIdAndUpdate(
        id,
        { savedStatus },
        { new: true }
      );
      if (!updatedVideo) {
        return res.status(404).json("video not found");
      }
  
      res.json(updatedVideo);
    } catch (error) {
      console.log(error);
    }
  });


     
  
  // get all regiestered details
// app.get("/registeredUsers", middleware,  async (req, res) => {
//     try {
//       const usersData = await User.find();
//       res.json(usersData);
//     } catch (error) {
//       console.log(error)
//     }
//   })
app.listen(port,()=>console.log(`server running at ${port}`));

