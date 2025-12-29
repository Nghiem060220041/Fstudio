import { ProductClient } from "./client";

export const revalidate = 0;

interface CategoryPageProps {
  params: {
    slug: string;
  },
  searchParams: {
    colorId: string;
    sizeId: string;
  }
}

const CategoryPage: React.FC<CategoryPageProps> = async ({ 
  params, 
  searchParams
}) => {

  return (
    <div className="container">    
      <div className="py-10">
        <ProductClient/>
        </div>
    </div>
  );
};

export default CategoryPage;