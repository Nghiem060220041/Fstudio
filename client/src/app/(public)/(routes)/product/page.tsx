import { AllProductClient } from "./client";

interface AllProductPageProps {
}

const AllProductPage: React.FC<AllProductPageProps> = ({ }) => {
    return (
      <div className="container">    
        <div className="py-10">
        <AllProductClient/>
        </div>
      </div>
  )
}

export default AllProductPage;