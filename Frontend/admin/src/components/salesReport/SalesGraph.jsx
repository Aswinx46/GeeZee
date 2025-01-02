import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const SalesGraph = ({ salesData }) => {
  // Transform the data for the chart
  const transformedData = useMemo(() => {
    return salesData.map(month => ({
      name: month.monthName,
      Orders: month.totalSalesCount,
      'Total Amount': month.totalOrderAmount,
      'Final Amount': month.totalFinalAmount,
      Discount: month.totalDiscount,
    }));
  }, [salesData]);

  // Calculate totals for the summary
  const totals = useMemo(() => {
    return salesData.reduce((acc, curr) => ({
      totalOrders: acc.totalOrders + curr.totalSalesCount,
      totalAmount: acc.totalAmount + curr.totalOrderAmount,
      totalDiscount: acc.totalDiscount + curr.totalDiscount,
      finalAmount: acc.finalAmount + curr.totalFinalAmount,
    }), {
      totalOrders: 0,
      totalAmount: 0,
      totalDiscount: 0,
      finalAmount: 0,
    });
  }, [salesData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totals.totalOrders}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totals.totalAmount.toLocaleString()}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Discount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">
                -₹{totals.totalDiscount.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Final Amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                ₹{totals.finalAmount.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Graph */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={transformedData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => `₹${value.toLocaleString()}`}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                  }}
                />
                <Legend />
                <Bar dataKey="Total Amount" fill="#8884d8" />
                <Bar dataKey="Final Amount" fill="#82ca9d" />
                <Bar dataKey="Discount" fill="#ff7c7c" />
                <Bar dataKey="Orders" fill="#8dd1e1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SalesGraph;

