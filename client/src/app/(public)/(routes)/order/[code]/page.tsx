import { OrderClient } from "./client";

interface CheckoutPageProps {
}

const OrderPage: React.FC<CheckoutPageProps> = ({ }) => {
    return (
      <div className="container">    
        <div className="py-10">
        <OrderClient/>
        </div>
      </div>
  )
}

export default OrderPage;