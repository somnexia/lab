const {Router} = require("express")
const Pricing =require("../models/pricing")
const router = Router()

router.get("/",(req,res)=> {
    res.render("addPricing",{
        title: "Add a pricing",
        isAdd: true
    })
})

router.post("/", async(req,res)=>{
    const pricing = new Pricing(req.body.title, req.body.price, req.body.img)

    await pricing.save()

    res.redirect("/addPricing")
})
module.exports= router