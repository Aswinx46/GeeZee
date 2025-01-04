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
import { CSVLink, CSVDownload } from "react-csv";
import SalesGraph from './SalesGraph'

// Helper function to get week number
const getWeekNumber = (date) => {
  const currentDate = new Date(date);
  const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
  const days = Math.floor((currentDate - startOfYear) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + startOfYear.getDay() + 1) / 7);
};

const SalesReport = () => {
  const [dateRange, setDateRange] = useState('month')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [update, setUpdate] = useState(false)
  const [salesReport, setSalesreport] = useState([])
  const [chartData, setChartData] = useState([])
  const [xAxisFormat, setXAxisFormat] = useState('month')

  useEffect(() => {
    const fetchData = async (req, res) => {
      try {
        const response = await axios.get('/salesReport', {
          params: {
            dateRange: 'month'
          }
        })
        setSalesreport(response.data.salesReport)
        formatChartData(response.data.salesReport, 'month')
      } catch (error) {
        console.log('error while fetching sales report initially', error)
      }
    }
    fetchData()
  }, [])

  const formatChartData = (data, range) => {
    let formattedData = [];
    
    switch(range) {
      case 'day':
        formattedData = data.map(report => ({
          name: new Date(report.createdOn).toLocaleDateString(),
          totalAmount: report.totalOrderAmount,
          orderCount: report.totalSalesCount
        }));
        setXAxisFormat('day');
        break;
      
      case 'week':
        formattedData = data.map(report => ({
          name: `Week ${getWeekNumber(report.createdOn)}`,
          totalAmount: report.totalOrderAmount,
          orderCount: report.totalSalesCount
        }));
        setXAxisFormat('week');
        break;
      
      case 'month':
        formattedData = data.map(report => ({
          name: report.monthName || new Date(report.createdOn).toLocaleString('default', { month: 'short' }),
          totalAmount: report.totalOrderAmount,
          orderCount: report.totalSalesCount
        }));
        setXAxisFormat('month');
        break;
      
      case 'year':
        formattedData = data.map(report => ({
          name: new Date(report.createdOn).getFullYear().toString(),
          totalAmount: report.totalOrderAmount,
          orderCount: report.totalSalesCount
        }));
        setXAxisFormat('year');
        break;
      
      default:
        formattedData = data.map(report => ({
          name: new Date(report.createdOn).toLocaleDateString(),
          totalAmount: report.totalOrderAmount,
          orderCount: report.totalSalesCount
        }));
        setXAxisFormat('custom');
    }
    
    setChartData(formattedData);
  };

  useEffect(() => {
    if (dateRange !== 'custom') {
      setStartDate('');
      setEndDate('');
    }
  }, [dateRange]);

  const handleGenarateReport = async () => {
    try {
      const response = await axios.get('/salesReport', {
        params: {
          startDate, 
          endDate, 
          dateRange
        }
      });
      
      setSalesreport(response.data.salesReport);
      
      console.log('this is the sales report',response.data.salesReport)
      formatChartData(response.data.salesReport, dateRange);
    } catch (error) {
      console.log('error while fetching sales report', error);
      toast.error(error.response?.data?.message || 'Error generating report');
    }
  };

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

  const csvData = [["Month/Year", "Total Sales",'totalDiscount','totalFinalAmount','totalOrderAmount']];

  salesReport.forEach((item) => {
    csvData.push([item.monthName, item.totalSalesCount,item.totalDiscount,item.totalFinalAmount,item.totalOrderAmount]);
  });


  const handleDownloadReport=()=>{
 
    
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
              <SelectItem value="year">This Year</SelectItem>
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
      <motion.div variants={itemVariants}>
        <Button onClick={handleDownloadReport} >   <CSVLink  data={csvData}>Download Report</CSVLink></Button>
      
      </motion.div>

      <SalesGraph salesData={salesReport}/>


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
                {salesReport.map((report, index) => (
                  <TableRow key={index}>
                    {/* <TableCell>{report?.createdOn[index]?.split('T')[0]}</TableCell> */}
                    <TableCell>{report.totalSalesCount}</TableCell>
                    <TableCell>${report.totalOrderAmount}</TableCell>
                    <TableCell>-${report.totalDiscount}</TableCell>
                    <TableCell>${report.totalFinalAmount}</TableCell>
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
