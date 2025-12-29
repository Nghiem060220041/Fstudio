import { SearchOrderClient } from "./client";

interface SearchOrderPageProps {
}

const SearchOrderPage: React.FC<SearchOrderPageProps> = ({ }) => {
    return (
      <div className="container">    
        <div className="py-10">
        <SearchOrderClient/>
        </div>
      </div>
  )
}

export default SearchOrderPage;