import { ProductClient } from "./client";

interface ProductPageProps {

}

const ProductPage: React.FC<ProductPageProps> = async ({ }) => {
    return (
      <div className="container">    
        <div className="py-10">
          <ProductClient />
        </div>
      </div>
  )
}

export default ProductPage;