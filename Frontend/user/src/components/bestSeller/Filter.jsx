import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import axios from '../../axios/userAxios'
const FilterModal = ({isOpen , setIsOpen,setProducts}) => {
//   const [isOpen, setIsOpen] = useState(false);
    const [priceRange, setPriceRange] = useState([0, 10000000]);
    const [brands, setBrands] = useState([])
    const [categories, setCategories] = useState([])
    const [selectedSort, setSelectedSort] = useState("");
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);


    useEffect(()=>{
        const fetchData=async (req,res) => {
            try {
                const brands=await axios.get('/brands')
                console.log('this is the brands',brands.data.brands)
                const categories=await axios.get('/categories')
                console.log('this is categories',categories.data.category)
                const brandName=brands.data.brands
                const categoryName=categories.data.category
                console.log(brandName,categoryName)
                setBrands(brandName)
                setCategories(categoryName)
            } catch (error) {
                console.log('error while fetching the data in filter component',error)
            }
        }
        fetchData()
      },[])



  const toggleModal = () => setIsOpen(!isOpen);

  const modalVariants = {
    closed: { x: "-100%", opacity: 0 },
    open: { x: 0, opacity: 1 }
  };

  const handleSortChange=(value)=>{
    setSelectedSort(value)
    console.log(value)
  }



  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };
  
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
    
  };

  const handleApplyFilter=async()=>{
    console.log('this is category',selectedCategories)
    console.log('this is brand',selectedBrands)
    console.log(priceRange)
    console.log('this is sort',selectedSort)

    const response = await axios.get("/filterProducts", {
        params: {
          sortBy: selectedSort,
          brands: selectedBrands,
          categories: selectedCategories,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
        },
      });
      console.log(response.data)
      setProducts(response.data)
      
  }

  return (
    <>
      <Button onClick={toggleModal} className="fixed left-4 top-4 z-50">
        <Filter className="mr-2 h-4 w-4" /> Filters
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={modalVariants}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 h-full w-80 bg-zinc-900 border-r border-zinc-800 shadow-lg shadow-[#39FF14]/20 z-50 overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                <h2 className="text-2xl font-bold text-[#39FF14]">Filters</h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleModal}
                  className="text-gray-400 hover:text-[#39FF14] transition-colors"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[#39FF14] font-medium">Sort By</Label>
                  <Select onValueChange={handleSortChange}>
                    <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-white hover:border-[#39FF14] transition-colors">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                      <SelectItem value="popularity" className="hover:bg-zinc-700">Popularity</SelectItem>
                      <SelectItem value="price-low-high" className="hover:bg-zinc-700">Price: Low to High</SelectItem>
                      <SelectItem value="price-high-low" className="hover:bg-zinc-700">Price: High to Low</SelectItem>
                      <SelectItem value="average-rating" className="hover:bg-zinc-700">Average Rating</SelectItem>
                      <SelectItem value="featured" className="hover:bg-zinc-700">Featured</SelectItem>
                      <SelectItem value="new-arrivals" className="hover:bg-zinc-700">New Arrivals</SelectItem>
                      <SelectItem value="a-z" className="hover:bg-zinc-700">A - Z</SelectItem>
                      <SelectItem value="z-a" className="hover:bg-zinc-700">Z - A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[#39FF14] font-medium">Price Range</Label>
                  <Slider
                    min={0}
                    max={100000}
                    step={10}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mt-2"
                  />
                  <div className="flex justify-between mt-2 text-gray-400">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[#39FF14] font-medium">Brand</Label>
                  <div className="space-y-2 mt-2">
                    {brands.map((brand) => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox id={brand} 
                        checked={selectedBrands.includes(brand._id)}
                        onCheckedChange={() => handleBrandChange(brand._id)}    
                        className="border-zinc-700 data-[state=checked]:bg-[#39FF14] data-[state=checked]:border-[#39FF14]" />
                        <Label htmlFor={brand} className="text-gray-300 hover:text-white cursor-pointer">{brand.name}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[#39FF14] font-medium">Category</Label>
                  <div className="space-y-2 mt-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox id={category} 
                         checked={selectedCategories.includes(category._id)}
                         onCheckedChange={() => handleCategoryChange(category._id)}
                        className="border-zinc-700 data-[state=checked]:bg-[#39FF14] data-[state=checked]:border-[#39FF14]" />
                        <Label htmlFor={category} className="text-gray-300 hover:text-white cursor-pointer">{category.categoryName}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Button onClick={handleApplyFilter} className="w-full bg-[#39FF14] text-black hover:bg-[#39FF14]/90 transition-colors font-medium">
                Apply Filters
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FilterModal;
