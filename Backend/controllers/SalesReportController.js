
const StatusCodes = require('../enums/httpStatusCode');
const Order = require('../models/OrderSchema');
const salesReport = async (req, res) => {
  try {
    const { startDate, endDate, dateRange } = req.query;

    let matchCondition = { status: 'Delivered' };
    const today = new Date();

    if (dateRange === 'custom' && startDate && endDate) {
      matchCondition.createdOn = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else {
      switch (dateRange) {
        case 'year':
          matchCondition.createdOn = {
            $gte: new Date(today.getFullYear(), 0, 1),
            $lte: new Date(today.getFullYear(), 11, 31),
          };
          break;
        case 'month':
          matchCondition.createdOn = {
            $gte: new Date(today.getFullYear(), today.getMonth(), 1),
            $lte: new Date(today.getFullYear(), today.getMonth() + 1, 0),
          };
          break;
        case 'week':
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - today.getDay());
          matchCondition.createdOn = { $gte: startOfWeek };
          break;
        case 'day':
          const startOfDay = new Date(today);
          startOfDay.setHours(0, 0, 0, 0);
          matchCondition.createdOn = { $gte: startOfDay };
          break;
        default:
          return res.status(400).json({ message: 'Invalid date range' });
      }
    }

    const salesReport = await Order.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: {
            year: { $year: '$createdOn' },
            month: { $month: '$createdOn' },
          },
          totalSalesCount: { $sum: 1 },
          totalOrderAmount: { $sum: '$totalPrice' },
          totalDiscount: { $sum: '$discount' },
          totalFinalAmount: { $sum: '$finalAmount' },
        },
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          totalSalesCount: 1,
          totalOrderAmount: 1,
          totalDiscount: 1,
          totalFinalAmount: 1,

        },
      },
      { $sort: { year: 1, month: 1 } },
    ]);

    return res.status(StatusCodes.OK).json({ message: 'Sales report fetched', salesReport });
  } catch (error) {
    console.error('Error while fetching sales report', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error while fetching sales report' });
  }
};


module.exports = {
  salesReport,
};
