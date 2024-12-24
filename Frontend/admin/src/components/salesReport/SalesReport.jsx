import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, DollarSign, Tag, ShoppingCart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import axios from '../../../axios/adminAxios'
import { toast } from 'react-toastify'
const SalesReport = () => {
  const [dateRange, setDateRange] = useState('custom')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const[update,setUpdate]=useState(false)
  const[salesReport,setSalesreport]=useState([])

  useEffect(() => {
    if (dateRange !== 'custom') {
      setStartDate('');
      setEndDate('');
    }
  }, [dateRange]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  }

  const handleGenarateReport=async()=>{
    console.log(startDate)
    console.log(endDate)
    console.log(dateRange)
    try {
        const response=await axios.get('/salesReport',{params:{
            startDate,endDate,dateRange
        }})
        console.log(response.data.salesReport)
        setSalesreport(response.data.salesReport)
    } catch (error) {
        console.log('error while fetching sales report',error)
        toast.error(error.data.response.message)
    }
  
  }
  return (
    <motion.div
      className="container mx-auto p-6 space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 className="text-3xl font-bold mb-6" variants={itemVariants}>
        Sales Report
      </motion.h1>

      <motion.div className="grid gap-6 md:grid-cols-2" variants={itemVariants}>
        <div>
          <Label htmlFor="dateRange">Date Range</Label>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger id="dateRange">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">1 Day</SelectItem>
              <SelectItem value="week">1 Week</SelectItem>  
              <SelectItem value="month">1 Month</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <AnimatePresence>
          {dateRange === 'custom' && (
            <motion.div 
              className="grid gap-4 md:grid-cols-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Button onClick={handleGenarateReport} >Generate Report</Button>
      </motion.div>

      <motion.div className="grid gap-6 md:grid-cols-4" variants={itemVariants}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sales
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{salesReport[0]?.totalOrderAmount}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{salesReport[0]?.totalSalesCount}</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Discounts
            </CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-{salesReport[0]?.totalDiscount}</div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Net Sales
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{salesReport[0]?.totalFinalAmount}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div 
        variants={itemVariants}
        className="w-full"
      >
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full h-[400px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { date: 'Jan', sales: 4000, orders: 240 },
                    { date: 'Feb', sales: 3000, orders: 198 },
                    { date: 'Mar', sales: 5000, orders: 300 },
                    { date: 'Apr', sales: 2780, orders: 180 },
                    { date: 'May', sales: 6890, orders: 390 },
                    { date: 'Jun', sales: 2390, orders: 167 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="sales"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="orders"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Detailed Sales Report</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead>Discounts</TableHead>
                  <TableHead>Net Sales</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date().toLocaleDateString()}</TableCell>
                    <TableCell>{Math.floor(Math.random() * 100)}</TableCell>
                    <TableCell>${(Math.random() * 10000).toFixed(2)}</TableCell>
                    <TableCell>-${(Math.random() * 1000).toFixed(2)}</TableCell>
                    <TableCell>${(Math.random() * 9000).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

export default SalesReport
