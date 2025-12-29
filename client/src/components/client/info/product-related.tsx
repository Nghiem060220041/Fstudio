import { Product } from "@/types";
import NoResults from "./no-results";
import ProductCard from "./card";

interface ProductRelatedProps {
  items: Product[]
}

const ProductRelated: React.FC<ProductRelatedProps> = ({
  items
}) => {
  return (
    <div className="space-y-4">
      {items.length === 0 && <NoResults />}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <ProductCard key={item.data.id} data={item.data} />
        ))}
      </div>
    </div>
   );
}
 
export default ProductRelated;