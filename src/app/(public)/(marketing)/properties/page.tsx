"use client"
import { useAllProperties } from '@/hooks/property.hooks';


const AllPropertyPage = () => {
    const{data}= useAllProperties()
    console.log(data)
    return (
        <div>
            
        </div>
    );
};

export default AllPropertyPage;