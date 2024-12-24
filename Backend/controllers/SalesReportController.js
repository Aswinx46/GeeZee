// const Order=require('../models/OrderSchema')

// const salesReport=async (req,res) => {
//     try {
//         const {startDate,endDate,dateRange}=req.query
//         console.log(startDate,endDate,dateRange)
//         let matchCondition={}

//         if(startDate && endDate)
//         {
//             matchCondition.createdOn={
//                 $gte:new Date(startDate),
//                 $lte:new Date(endDate)
//             }

//             if(dateRange)
//             {
//                 const today=new Date()
//                 if(dateRange == 'day')
//                 {
//                     matchCondition.createdOn={
//                         $gte:new Date(today.setDate(today.getDate() - 1))
//                     }
//                 }else if(dateRange == 'week')
//                 {
//                     matchCondition.createdOn={
//                         $gte:new Date(today.setDate(today.getDate() - 7))
//                     }
//                 }else if(dateRange == 'month')
//                 {
//                     $gte:new Date(today.setMonth(today.getMonth() - 1))
//                 }
//             }
//         }

//         const salesReport=await Order.aggregate([
//             {$match: matchCondition},
//             {
//                 $group:{
//                     _id:null,
//                     totalSalesCount:{$sum : 1},
//                     totalOrderAmount:{$sum : '$totalPrice'},
//                     totalDiscount:{$sum : '$discount'},
//                     totalFinalAmount:{$sum : '$finalAmount'}
//                 }
//             }
//         ])

//         console.log(salesReport)

//     } catch (error) {
//         console.log('error while fetching salesReport',error)
//         return res.status(500).json({message:"error while fetching salesReport"})
//     }
// }

// module.exports={
//     salesReport
// }

const Order = require('../models/OrderSchema');

const salesReport = async (req, res) => {
  try {
    const { startDate, endDate, dateRange } = req.query;
    console.log(startDate, endDate, dateRange);
    let matchCondition = {};

    // Check if startDate and endDate are provided
    if (startDate && endDate) {
      matchCondition.createdOn = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (dateRange) {
      // If dateRange is provided and startDate/endDate are not
      const today = new Date();
      if (dateRange === 'day') {
        matchCondition.createdOn = {
          $gte: new Date(today.setDate(today.getDate() - 1)),
        };
      } else if (dateRange === 'week') {
        matchCondition.createdOn = {
          $gte: new Date(today.setDate(today.getDate() - 7)),
        };
      } else if (dateRange === 'month') {
        matchCondition.createdOn = {
          $gte: new Date(today.setMonth(today.getMonth() - 1)),
        };
      }
    }

    // Aggregate sales report
    const salesReport = await Order.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: null,
          totalSalesCount: { $sum: 1 },
          totalOrderAmount: { $sum: '$totalPrice' },
          totalDiscount: { $sum: '$discount' },
          totalFinalAmount: { $sum: '$finalAmount' },
        },
      },
    ]);

    console.log(salesReport);
    return res.status(200).json({message:"Sales report fetched",salesReport});
  } catch (error) {
    console.error('Error while fetching sales report', error);
    return res
      .status(500)
      .json({ message: 'Error while fetching sales report' });
  }
};

module.exports = {
  salesReport,
};
