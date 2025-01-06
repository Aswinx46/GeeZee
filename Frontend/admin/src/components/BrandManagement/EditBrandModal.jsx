import React from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import axios from '../../../axios/adminAxios';
import { toast } from 'react-toastify';
const EditBrandModal = ({ isOpen, setIsOpen, brandName, setBrandName, onSave ,brandId}) => {

  const handleSave=async()=>{
  
    try {
      
      const response=await axios.patch(`/editBrandName/${brandId}`,{brandName})
      toast.success(response.data.message)
      setIsOpen(false)

    } catch (error) {
      console.log('error while updating the brand',error)
      toast.error('error while updating brand')
    }

  }

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold">Edit Brand</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="brandName" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Brand Name
            </label>
            <Input
              id="brandName"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Enter brand name"
            />
          </div>
          
          <Button 
            className="w-full" 
            // onClick={() => {
            //   // onSave();
            //   // setIsOpen(false);
            //   handleSave
            // }}
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditBrandModal;
