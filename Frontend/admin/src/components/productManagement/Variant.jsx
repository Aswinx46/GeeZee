import React, { useState } from 'react';

const ProductForm = () => {
    const [attributes, setAttributes] = useState([]); 
    const [variants, setVariants] = useState([]); 
    const [newAttribute, setNewAttribute] = useState({ name: '', values: '' }); 
    const [newVariant, setNewVariant] = useState({ price: '', stock: '', selectedAttributes: {} });
    const [productDetails, setProductDetails] = useState({ title: '', sku: '', description: '', basePrice: '' });

    const handleAddAttribute = () => {
        if (newAttribute.name && newAttribute.values) {
            const valuesArray = newAttribute.values.split(',').map((v) => v.trim());
            setAttributes([...attributes, { name: newAttribute.name, values: valuesArray }]);
            setNewAttribute({ name: '', values: '' });
        }
    };

    const handleAddVariant = () => {
        setVariants([...variants, { ...newVariant }]);
        setNewVariant({ price: '', stock: '', selectedAttributes: {} });
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-800">Product Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="number"
                        placeholder="stock"
                        value={productDetails.stock}
                        onChange={(e) => setProductDetails({ ...productDetails, title: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                    <input
                        type="text"
                        placeholder="SKU"
                        value={productDetails.sku}
                        onChange={(e) => setProductDetails({ ...productDetails, sku: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                </div>
                <textarea
                    placeholder="Description"
                    value={productDetails.description}
                    onChange={(e) => setProductDetails({ ...productDetails, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent min-h-[100px]"
                ></textarea>
                <input
                    type="number"
                    placeholder="Base Price (optional, for products without variants)"
                    value={productDetails.basePrice}
                    onChange={(e) => setProductDetails({ ...productDetails, basePrice: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                />
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Add Attributes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Attribute Name (e.g., RAM)"
                        value={newAttribute.name}
                        onChange={(e) => setNewAttribute({ ...newAttribute, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                    <input
                        type="text"
                        placeholder="Values (comma-separated, e.g., 8GB,16GB)"
                        value={newAttribute.values}
                        onChange={(e) => setNewAttribute({ ...newAttribute, values: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                </div>
                <button
                    type="button"
                    onClick={handleAddAttribute}
                    className="w-full md:w-auto px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-200"
                >
                    Add Attribute
                </button>
            </div>

            {attributes.length > 0 && (
                <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-700">Current Attributes:</h4>
                    <ul className="space-y-2">
                        {attributes.map((attr, idx) => (
                            <li key={idx} className="p-3 bg-gray-50 rounded-md">
                                <span className="font-medium">{attr.name}:</span> {attr.values.join(', ')}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {attributes.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Add Variants</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {attributes.map((attr, idx) => (
                            <select
                                key={idx}
                                onChange={(e) =>
                                    setNewVariant({
                                        ...newVariant,
                                        selectedAttributes: { ...newVariant.selectedAttributes, [attr.name]: e.target.value },
                                    })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                            >
                                <option value="">{`Select ${attr.name}`}</option>
                                {attr.values.map((val, vidx) => (
                                    <option key={vidx} value={val}>
                                        {val}
                                    </option>
                                ))}
                            </select>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="number"
                            placeholder="Price"
                            value={newVariant.price}
                            onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                        <input
                            type="number"
                            placeholder="Stock"
                            value={newVariant.stock}
                            onChange={(e) => setNewVariant({ ...newVariant, stock: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleAddVariant}
                        className="w-full md:w-auto px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-200"
                    >
                        Add Variant
                    </button>
                </div>
            )}

            {variants.length > 0 && (
                <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-700">Current Variants:</h4>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {attributes.map((attr, idx) => (
                                        <th key={idx} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {attr.name}
                                        </th>
                                    ))}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {variants.map((variant, idx) => (
                                    <tr key={idx}>
                                        {attributes.map((attr, attrIdx) => (
                                            <td key={attrIdx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {variant.selectedAttributes[attr.name]}
                                            </td>
                                        ))}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{variant.price}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{variant.stock}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className="flex justify-end">
                <button
                    type="submit"
                    className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-200"
                >
                    Save Product
                </button>
            </div>
        </div>
    );
};

export default ProductForm;
