const express=require("express");
const app=express();
// const port=8080;
const port = process.env.PORT || 8080;
const mongoose = require('mongoose');
const Listing=require("./models/listing.js");
const path=require("path");
const ejsMate=require("ejs-mate");
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
const methodOverride=require("method-override");
app.use(methodOverride ("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));



main()
.then(()=>{
    console.log("connection success");
})
.catch(err => console.log(err)); 
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
  
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
  }
  app.get("/testlisting",async(req,res)=>{
    let sampleListing=new Listing({
        title:"My new villa",
        description:"By the beach",
        price:12000,
        location:"karachi near sea",
        country:"Pakistan"
    });
    await sampleListing.save();
    console.log("sample was saved");
    res.send("successful testing");
})
app.get("/",(req,res)=>{
    res.send("server is running");
})
//index route
app.get("/listings",async ( req,res)=>{
    const allListings= await Listing.find({});
    console.log(allListings);
    res.render("listings/index.ejs", {allListings});
})
///new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
})
///show route
app.get("/listings/:id",async(req,res)=>{
  let {id}=req.params;
  const listing=await Listing.findById(id);
  res.render("listings/show.ejs", {listing});
})
///create route
app.post("/listings", async (req, res,next) => {
    try{
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
      
    } catch(err) {
        next(err);
    }

});
///edit route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}
);///update route
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  });
// //Delete route
app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    let deletedlist= await Listing.findByIdAndDelete(id);
    // console.log(deletedlist);
    res.redirect("/listings");
})
app.post('/listings/:id/buy', async (req, res) => {
    const listingId = req.params.id;
  
    // Assuming you are fetching the listing from the database
    const listing = await Listing.findById(listingId);
  
    // Pass the listing object to the EJS file
    if (listing) {
      res.render('listings/payment', { listing });
    } else {
      res.status(404).send('Listing not found');
    }
  });
  
  
  
// app.use((err,req,res,next)=>{
//     res.send("something went wrong");
// })

app.listen(port,()=>{
      console.log(`App is listening on port: ${port}`);
});
