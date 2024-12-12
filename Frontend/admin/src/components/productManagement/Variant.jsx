import React, { useState } from 'react';
import { addVariant } from '@/redux/slices/variantSlice';
import { useDispatch } from 'react-redux';
const ProductForm = ({varientCallback,setIsVariantModalOpen}) => {
    const [attributes, setAttributes] = useState([]); 
    const [variants, setVariants] = useState([]); 
    const [newAttribute, setNewAttribute] = useState({ name: '', values: '' }); 
    const [newVariant, setNewVariant] = useState({ price: '', stock: '', selectedAttributes: {} });
    const [productDetails, setProductDetails] = useState({ title: '', sku: '', description: '', basePrice: '' });
    const [editingVariant, setEditingVariant] = useState(null);
    const [selectedAttribute, setSelectedAttribute] = useState('');

    const dispatch=useDispatch()
    const handleAddAttribute = () => {
        if (newAttribute.name && newAttribute.values) {
            const valuesArray = newAttribute.values.split(',').map((v) => v.trim());
            
            if (selectedAttribute) {
                // Add values to existing attribute
                setAttributes(attributes.map(attr => {
                    const attrName = Object.keys(attr)[0];
                    if (attrName === selectedAttribute) {
                        // Combine existing values with new values, remove duplicates
                        const existingValues = attr[attrName];
                        const combinedValues = [...new Set([...existingValues, ...valuesArray])];
                        return { [attrName]: combinedValues };
                    }
                    return attr;
                }));
            } else {
                // Create new attribute
                const existingAttr = attributes.find(attr => Object.keys(attr)[0] === newAttribute.name);
                if (!existingAttr) {
                    setAttributes([...attributes, { [newAttribute.name]: valuesArray }]);
                }
            }
            setNewAttribute({ name: '', values: '' });
            setSelectedAttribute('');
        }
    };

    const handleAttributeSelect = (attrName) => {
        setSelectedAttribute(attrName);
        setNewAttribute({ ...newAttribute, name: attrName });
    };

    const handleAddVariant = () => {
        if (editingVariant !== null) {
            // Update existing variant
            const updatedVariants = variants.map((variant, index) =>
                index === editingVariant ? { ...newVariant } : variant
            );
            setVariants(updatedVariants);
            setEditingVariant(null);
        } else {
            // Add new variant
            setVariants([...variants, { ...newVariant }]);
        }
        setNewVariant({ price: '', stock: '', selectedAttributes: {} });
    };

    const handleEditVariant = (index) => {
        setEditingVariant(index);
        setNewVariant({ ...variants[index] });
    };

    const handleDeleteVariant = (index) => {
        const updatedVariants = variants.filter((_, idx) => idx !== index);
        setVariants(updatedVariants);
    };

    const cancelEdit = () => {
        setEditingVariant(null);
        setNewVariant({ price: '', stock: '', selectedAttributes: {} });
    };

    const handleSaveVariant = (e) => {
        e.preventDefault()
        console.log(variants);
        // dispatch(addVariant(variants))
        varientCallback(variants,attributes)
        setIsVariantModalOpen(false)
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Add Attributes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {attributes.length > 0 && (
                        <select
                            value={selectedAttribute}
                            onChange={(e) => handleAttributeSelect(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                        >
                            <option value="">Create New Attribute</option>
                            {attributes.map((attr, idx) => (
                                <option key={idx} value={Object.keys(attr)[0]}>
                                    {Object.keys(attr)[0]}
                                </option>
                            ))}
                        </select>
                    )}
                    {!selectedAttribute && (
                        <input
                            type="text"
                            placeholder="Attribute Name (e.g., RAM)"
                            value={newAttribute.name}
                            onChange={(e) => setNewAttribute({ ...newAttribute, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                    )}
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
                    {selectedAttribute ? `Add Values to ${selectedAttribute}` : 'Add Attribute'}
                </button>
            </div>

            {attributes.length > 0 && (
                <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-700">Current Attributes:</h4>
                    <ul className="space-y-2">
                        {attributes.map((attr, idx) => (
                            <li key={idx} className="p-3 bg-gray-50 rounded-md">
                                <span className="font-medium">
                                    {Object.keys(attr)[0]}:
                                </span>{' '}
                                {attr[Object.keys(attr)[0]].join(', ')}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {attributes.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Add Variants</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {attributes.map((attr, idx) => {
                            const attributeName = Object.keys(attr)[0];
                            return (
                                <select
                                    key={idx}
                                    onChange={(e) =>
                                        setNewVariant({
                                            ...newVariant,
                                            selectedAttributes: {
                                                ...newVariant.selectedAttributes,
                                                [attributeName]: e.target.value,
                                            },
                                        })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                                >
                                    <option value="">{`Select ${attributeName}`}</option>
                                    {attr[attributeName].map((val, vidx) => (
                                        <option key={vidx} value={val}>
                                            {val}
                                        </option>
                                    ))}
                                </select>
                            );
                        })}
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
                        {editingVariant !== null ? 'Update Variant' : 'Add Variant'}
                    </button>
                    {editingVariant !== null && (
                        <button
                            type="button"
                            onClick={cancelEdit}
                            className="ml-2 px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            )}

            {variants.length > 0 && (
                <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-700">Current Variants:</h4>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {attributes.map((attr, idx) => (
                                    <th key={idx} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {Object.keys(attr)[0]}
                                    </th>
                                ))}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {variants.map((variant, idx) => (
                                <tr key={idx} className={editingVariant === idx ? 'bg-yellow-50' : ''}>
                                    {attributes.map((attr, attrIdx) => (
                                        <td key={attrIdx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {variant.selectedAttributes[Object.keys(attr)[0]]}
                                        </td>
                                    ))}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{variant.price}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{variant.stock}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <button
                                            onClick={() => handleEditVariant(idx)}
                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteVariant(idx)}
                                            className="text-red-600 hover:text-red-800 font-medium ml-2"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="flex justify-end">
                <button
                    type="submit"
                    onClick={(e)=>handleSaveVariant(e)}
                    className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-200"
                >
                    Save Variant
                </button>
            </div>
        </div>
    );
};

export default ProductForm;
