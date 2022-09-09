const router = require("express").Router();

const { verifyToken, authorization } = require("../middleware/verifyToken");
const { getUserSubscription } = require("../middleware/subscription");
const {
  createOrder,
  updateOrder,
  getAllOrder,
  getUserOrders,
  getOrder,
  confirmOrder,
} = require("../controller/orderController");

router.post("/", verifyToken, getUserSubscription, createOrder);

router.put("/:id", verifyToken, updateOrder);

router.get("/:productId", verifyToken, getUserSubscription, getOrder);

router.get("/find/:userId", verifyToken, getUserSubscription, getUserOrders);
//get all
router.get("/", verifyToken, getAllOrder);
router.put("/buy/:id", verifyToken, confirmOrder);

//get monthly income
// router.get("/income",verifyToken,authorization,async(req,res)=>{
//     const date=new Date()
//     const lastMonth=new Date(date.setMonth(date.getMonth()-1))
//     const previousMonth=new Date(date.setMonth(lastMonth.getMonth()-1))
//     try{
// const data=await Order.aggregate([{

//     $match:{createdAt:{$gte:previousMonth}}
// },{
//     $project:{
//         month:{$month:"$createdAt"},
//         sales:"$amount"
//     }
// },{$group:{
//     _id:"$month",
//     total:{$sum:"$sales"}
// }}])

// res.status(200).send({status:200,data})
//     }catch(err)
//     {console.log('error',err)
//         res.status(500).send({status:500,data:err})
//     }
// })

module.exports = router;
