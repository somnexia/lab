const{Router} = require("express")
const Pricing = require("../services/Pricing")
const router = Router()

router.get("/", async(req,res)=> {
    const pricings = await Pricing.getAll()

    res.render("pricings",{
        title: "Pricings",
        isPricings: true,
        pricings
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
    res.redirect("/pricings")
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