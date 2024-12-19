const Category = require('../models/categorySchema')
const addCategory = async (req, res) => {
    const { newCategory } = req.body
    console.log(newCategory)
    try {
        const exists = await Category.findOne({ categoryName: newCategory })
        if (exists) return res.status(400).json({ message: "this category is already exits" })
        const newCat = new Category({
            categoryName: newCategory,
            status: 'active'
        })
        await newCat.save()
        return res.status(201).json({ message: "category created" })
    } catch (error) {
        console.log('error while creating category', error)
        return res.status(400).json({ message: 'error while creating the category' })
    }
}
const showCategory = async (req, res) => {
    try {
        const category = await Category.find()
        if (!category) return res.status(400).json({ message: "no category found" })
        res.status(200).json({ message: "category list fetched", category })
    } catch (error) {
        console.log('error in fetching the data', error)
        res.status(400).json({ message: "error in fetching the category" })
    }
}

const editCategory = async (req, res) => {
    const { id } = req.params
    const { status } = req.body
    try {
        const category = await Category.findByIdAndUpdate(id, { status }, { new: true })
        console.log('edit done', category)
        return res.status(200).json({ message: "category edited", category })
    } catch (error) {
        console.log('error while editing the category', error)
        return res.status(400).json({ message: 'error while editing the category' })
    }
}

const editCategoryName = async (req, res) => {
    const { id } = req.params
    const { editNameCategory } = req.body
    console.log(id, editNameCategory)
    try {
        const changeName = await Category.findByIdAndUpdate(id, { categoryName: editNameCategory }, { new: true })
        console.log(changeName)
        return res.status(200).json({ message: "the category name changed", changeName })
    } catch (error) {
        console.log('error in changing the name of the category name', error)
        return res.status(400).json({ message: "error in changing the name of the category" })
    }
}

module.exports = {
    addCategory,
    showCategory,
    editCategory,
    editCategoryName
}