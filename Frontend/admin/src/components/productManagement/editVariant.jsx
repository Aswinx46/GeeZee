import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AttributeModal = ({ isOpen, onClose, onSave, Varient, index, setVarient, setIsOpen }) => {
    const [attributeName, setAttributeName] = useState('');
    const [attributeValue, setAttributeValue] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [varients, setVarients] = useState([])
    const [entries, setEntries] = useState([])

    useEffect(() => {
        console.log(Varient)
        setVarients(Varient)
        // console.log(varients[0].selectedAttributes)
        const keys = Object.entries(Varient[index].selectedAttributes)
        console.log('this is the values', keys)
        setEntries(keys)
        setPrice(Varient[index]?.price)
        setStock(Varient[index]?.stock)


    }, [])
    console.log(varients)



    const handleChange = (index, field, value) => {
        setEntries((prev) => {
            const updatedEntries = [...prev]
            if (field === 'key') {
                updatedEntries[index][0] = value
            } else if (field === 'value') {
                updatedEntries[index][1] = value
            }
            return updatedEntries
        })

    }


    const handleSave = () => {
        // onSave({ attributeName, attributeValue, price, stock });

        console.log("this is entries", entries)
        console.log(price)
        console.log(stock)
        const result = entries.reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
        }, {});
        setVarient((prev) => ([...prev.map((item, i) => i === index ? ({ ...item, price, stock, selectedAttributes: { ...result } }) : item)]))
        setIsOpen(false);
        console.log(varients)
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", damping: 15 }}
                        className="bg-white rounded-lg p-6 w-full max-w-md"
                    >
                        <h2 className="text-2xl font-bold mb-4">Add Attribute</h2>
                        <div className="space-y-4">

                            <div>
                                <label htmlFor="attributeValue" className="block text-sm font-medium text-gray-700 mb-1">
                                    Attribute Value
                                </label>

                                {entries.map(([key, value], index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        id="attributeName"
                                        value={value} // Display the attribute name
                                        onChange={(e) => handleChange(index, 'value', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                ))}

                            </div>
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                    Price
                                </label>
                                <input
                                    type="number"
                                    id="price"
                                    value={price || ""}
                                    onChange={(e) => setPrice(Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                                    Stock
                                </label>
                                <input
                                    type="number"
                                    id="stock"
                                    value={stock}
                                    onChange={(e) => setStock(Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSave}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Save
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AttributeModal;

