
const Order = require('../models/OrderSchema');

const salesReport = async (req, res) => {
  try {
    const { startDate, endDate, dateRange } = req.query;
    console.log(startDate, endDate, dateRange);
    let matchCondition = {status : 'Delivered'};
    console.log(dateRange)
    const today = new Date();
    // Check if startDate and endDate are provided
    // if (startDate && endDate) {
    //   matchCondition.createdOn = {
    //     $gte: new Date(startDate),
    //     $lte: new Date(endDate),
    //   };
    // } else if (dateRange) {
    //   // If dateRange is provided and startDate/endDate are not
    //   const today = new Date();
    //   if (dateRange === 'day') {
    //     matchCondition.createdOn = {
    //       $gte: new Date(today.setDate(today.getDate() - 1)),
    //     };
    //   } else if (dateRange === 'week') {
    //     matchCondition.createdOn = {
    //       $gte: new Date(today.setDate(today.getDate() - 7)),
    //     };
    //   } else if (dateRange === 'month') {
    //     matchCondition.createdOn = {
    //       $gte: new Date(today.setMonth(today.getMonth() - 1)),
    //     };
    //   }
    // }
    if (dateRange === 'custom' && startDate && endDate) {
      matchCondition.createdOn = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else {
      // Handle predefined date ranges
      switch (dateRange) {
        case 'year':
          matchCondition.createdOn = {
            $gte: new Date(today.getFullYear(), 0, 1), // Jan 1 of the current year
            $lte: new Date(today.getFullYear(), 11, 31), // Dec 31 of the current year
          };
          break;

        case 'month':
          matchCondition.createdOn = {
            $gte: new Date(today.getFullYear(), today.getMonth(), 1), // First day of the current month
            $lte: new Date(today.getFullYear(), today.getMonth() + 1, 0), // Last day of the current month
          };
          break;

        case 'week':
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - today.getDay()); // Start of the week
          matchCondition.createdOn = {
            $gte: startOfWeek,
          };
          break;

        case 'day':
          const startOfDay = new Date(today);
          startOfDay.setDate(today.getDate() - 1); // Start of the last 24 hours
          matchCondition.createdOn = {
            $gte: startOfDay,
          };
          break;

        default:
          return res.status(400).json({ message: 'Invalid date range' });
      }
    }
    // Aggregate sales report
    const salesReport = await Order.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: { month: { $dateToString: { format: '%B', date: '$createdOn' } } },
          totalSalesCount: { $sum: 1 },
          totalOrderAmount: { $sum: '$totalPrice' },
          totalDiscount: { $sum: '$discount' },
          totalFinalAmount: { $sum: '$finalAmount' },
          createdOn: { $push: '$createdOn' },
        },
      },
      {
        $project: {
          _id: 0, // Remove the default MongoDB `_id` field
          monthName: '$_id.month',
          totalSalesCount: 1,
          totalOrderAmount: 1,
          totalDiscount: 1,
          totalFinalAmount: 1,          
          createdOn:1
        },
      },
      { $sort: { 'monthName': 1 } }, // Sort alphabetically by month name (or adjust if numeric order is needed)
    ]);

    console.log(salesReport);
    return res.status(200).json({ message: "Sales report fetched", salesReport });
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
