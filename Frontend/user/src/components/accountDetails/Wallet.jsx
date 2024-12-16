import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, SendHorizontal, ScanLine, ChevronRight } from 'lucide-react';

const Wallet = () => {
  const [balance, setBalance] = useState(1234.56);
  const [transactions, setTransactions] = useState([
    { id: 1, description: 'Coffee Shop', amount: -4.50, date: '2023-06-15' },
    { id: 2, description: 'Salary Deposit', amount: 2000, date: '2023-06-14' },
    { id: 3, description: 'Grocery Store', amount: -65.30, date: '2023-06-13' },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleAddMoney = () => {
    setIsLoading(true);
    // Simulating API call
    setTimeout(() => {
      setBalance(prevBalance => prevBalance + 100);
      setTransactions(prevTransactions => [
        { id: Date.now(), description: 'Added Money', amount: 100, date: new Date().toISOString().split('T')[0] },
        ...prevTransactions
      ]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg p-6 w-full mb-20 max-w-md"
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-bold mb-6"
        >
          My Wallet
        </motion.h1>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-black text-white rounded-lg p-6 mb-6"
        >
          <p className="text-sm mb-2">Current Balance</p>
          <motion.h2
            key={balance}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl font-bold"
          >
            ${balance.toFixed(2)}
          </motion.h2>
        </motion.div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { icon: PlusCircle, label: 'Add Money', action: handleAddMoney },
            { icon: SendHorizontal, label: 'Send Money', action: () => console.log('Send Money') },
            { icon: ScanLine, label: 'Scan QR', action: () => console.log('Scan QR') },
          ].map((button, index) => (
            <motion.button
              key={button.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={button.action}
              className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-3 transition-colors hover:bg-gray-200"
              disabled={isLoading}
            >
              <button.icon className="mb-2" size={24} />
              <span className="text-sm">{button.label}</span>
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
          <AnimatePresence>
            {transactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="flex justify-between items-center border-b border-gray-200 py-3"
              >
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-gray-500">{transaction.date}</p>
                </div>
                <p className={`font-semibold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${Math.abs(transaction.amount).toFixed(2)}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-6 bg-black text-white py-3 rounded-lg flex items-center justify-center"
        >
          View All Transactions
          <ChevronRight className="ml-2" size={18} />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Wallet;
