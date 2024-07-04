const{Router} = require("express")
const Pricing = require("../models/pricing")
const router = Router()

router.get("/", async(req,res)=> {
    const pricing = await Pricing.getAll()

    res.render("pricing",{
        title: "Pricing",
        isPricing: true,
        pricing
    })
})  

router.get("/:id/edit", async(req,res)=>{
    if(!req.query.allow){
        return res.redirect("/")
    }
    const pricing = await Pricing.getById(req.params.id)
    res.render("Pricing-edit",{
        title: `Edit ${pricing.title}`,
        pricing
    })
})
router.post("/edit",async(req,res)=>{
    await Pricing.update(req.body)
    res.redirect("/pricing")
})

router.get("/:id",async(req,res)=>{
    const pricing = await Pricing.getById(req.params.id)
    res.render("pricing",{
        layout:"empty",
        title: `Pricing ${pricing.title}`,
        pricing
    })
})
module.exports= router