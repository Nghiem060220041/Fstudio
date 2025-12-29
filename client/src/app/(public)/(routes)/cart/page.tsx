import { CartClient } from "./client";

interface CartPageProps {
}

const CartPage: React.FC<CartPageProps> = async ({ }) => {
    return (
      <div className="container">    
        <div className="py-10">
        <CartClient/>
        </div>
      </div>
  )
}

export default CartPage;