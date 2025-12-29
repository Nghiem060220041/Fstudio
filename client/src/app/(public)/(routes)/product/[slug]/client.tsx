"use client"

import Loading from "@/app/(public)/loading";
import Gallery from "@/components/client/gallery";
import ProductList from "@/components/client/info/list";
import Info from "@/components/client/info/product-detail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/types";
import axios from "axios";
import { Send } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
  
interface ProductClientProps {
}

const URL = process.env.NEXT_PUBLIC_URL_API;

export const ProductClient: React.FC<ProductClientProps> = ({ }) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [products, setProducts] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [productRelateds, setProductRelateds] = useState([]);
    const [options, setOptions] = useState([]);
    const [newData, setNewData] = useState([]);
    const params = useParams();
    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await axios.get(`${URL}/api/products/public-store/${params.slug}/findWithProperty`, {
                    params: Object.fromEntries(searchParams)
                });

                if (response.status === 200) {
                    const data = response.data;
                    setProduct(data.data);
                    setOptions(data.options);
                    setNewData(data.newData);
                } else {
                    setProduct(null);
                    setOptions([]);
                    setNewData([]);
                }
            } catch (error) {
            }
        };
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${URL}/api/products/public-store/all-product`);

                if (response.status === 200) {
                    const data = response.data;
                    setProducts(data.data);
                } else {
                    setProducts([]);
                }
            } catch (error) {
            }
        };

        const fetchProductRealateds = async () => {
            try {
                const response = await axios.get(`${URL}/api/products/public-store/${params.slug}/product-related`);

                if (response.status === 200) {
                    const data = response.data;
                    setProductRelateds(data.data);
                } else {
                    setProductRelateds([]);
                }
            } catch (error) {
            }
        };

        const fetchCoupons = async () => {
            try {
                const response = await axios.get(`${URL}/api/coupons/public-store/get-all-coupon`);

                if (response.status === 200) {
                    const data = response.data;
                    setCoupons(data.data);
                } else {
                    setCoupons([]);
                }
            } catch (error) {
            }
        };

        fetchProducts();
        fetchProductRealateds();
        fetchBanners();
        fetchCoupons();
    }, [params]);

    return (
        <>
            <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8 mb-16">
            <Suspense fallback={<Loading />}>
                <Gallery images={product?.galleries} />
                <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                    <Info data={product} options={options} newData={newData} coupons={coupons} />
                </div>
            </Suspense>
            </div>
            <ProductList title="Sản phẩm liên quan" items={productRelateds}/>
            <br className="my-16" />
            <h3 className="font-bold text-3xl flex justify-center">Câu hỏi thường gặp</h3>
            <div className="p-4 border rounded-lg mt-4">
                <h4 className="font-bold">1. Tôi muốn giao hàng tận nhà thì phải làm như nào?</h4>
                <Separator className="my-2" />
                <p className="text-sm">Bạn vui lòng thêm sản phẩm vào giỏ hàng, cập nhật thông tin cá nhân, chọn giao hàng tại nhà(COD) trong phạm vi chúng tôi hỗ trợ.</p>
            </div>
            <div className="p-4 border rounded-lg mt-4">
                <h4 className="font-bold">2. Tôi gặp rắc rối trong quá trình sử dụng thì liên hệ với ai tại đâu?</h4>
                <Separator className="my-2" />
                <p className="text-sm">Bạn vui lòng để lại thông tin cá nhân của mình như điện thoại để chúng tôi hỗ trợ bạn sớm nhất.</p>
            </div>
            <div className="p-4 border rounded-lg mt-4">
                <h4 className="font-bold">3. Sản phẩm tôi mua bị lỗi thì đổi trả ở đâu?</h4>
                <Separator className="my-2" />
                <p className="text-sm">Bạn có thể mang sản phẩm đến cửa hàng gần nhất để được nhân viên hỗ trợ.</p>
            </div>
            <div className="p-4 border rounded-lg mt-4">
                <h4 className="font-bold">4. Tôi lỡ đặt nhầm sản phẩm thì hủy đơn hàng kiểu gì?</h4>
                <Separator className="my-2" />
                <p className="text-sm">Bạn có thể liên hệ với số điện thoại hỗ trợ của chúng tôi để được hỗ trợ sớm nhất.</p>
            </div>
            <div className="p-4 border rounded-lg mt-4">
                <h4 className="font-bold">5. Tôi muốn lên đời sản phẩm không biết có hỗ trợ chương trình đó không?</h4>
                <Separator className="my-2" />
                <p className="text-sm">Bạn có thể liên hệ với số điện thoại hỗ trợ của chúng tôi để được hỗ trợ sớm nhất.</p>
            </div>
            <br className="my-16" />
            <div className="w-full bg-gray-50 py-16 px-4 rounded-lg">
                <h3 className="font-bold text-3xl flex justify-center">Đăng ký nhận tin mới nhất từ chúng tôi</h3>
                <p className="text-sm flex justify-center">Đừng bỏ lỡ khuyến mãi mới nhất từ chúng tôi.</p>
                <div className="mt-4 flex justify-center">
                    <Input className="w-1/4 mr-2" placeholder="Nhập địa chỉ email"/>
                    <Button variant="default">
                        <Send className="w-4 h-4 mr-2"/> Đăng ký
                    </Button>
                </div>
            </div>
        </>
    );
}