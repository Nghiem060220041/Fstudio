"use client"

import { BlogGrid, BlogSkeletonGrid } from "@/components/client/blog-grid";
import Carousel from "@/components/client/carousel";
import { ProductGrid, ProductSkeletonGrid } from "@/components/client/product-grid";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading-home";
import { Separator } from "@/components/ui/separator";
import { Banner, Product } from "@/types";
import axios from "axios";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import useSWRImmutable from "swr/immutable";

interface HomePageProps {
};

const URL = process.env.NEXT_PUBLIC_URL_API;

const HomePage: React.FC<HomePageProps> = () => {
    const router = useRouter();

    const { data: banners } = useSWRImmutable<Banner[]|null>([`${URL}/api/banners/get-all/store`],
        (url: string) =>
        axios
            .get(url)
            .then((res) => res.data.data)
    );
    const { data: products } = useSWRImmutable<Product[]|null>([`${URL}/api/products/public-store/all-product`],
        (url: string) =>
        axios
            .get(url)
            .then((res) => res.data.data)
    );
    const { data: productTrendings } = useSWRImmutable<Product[]|null>([`${URL}/api/products/public-store/product-trending`],
        (url: string) =>
        axios
            .get(url)
            .then((res) => res.data.data)
    );
    const blogs = [
        {
            name: "Test 1",
            slug: "test-1",
            id: "1",
        },
        {
            name: "Test 2",
            slug: "test-2",
            id: "2",
        },
        {
            name: "Test 3",
            slug: "test-3",
            id: "1",
        }
    ]

    return (
        <>
            {
                banners && (
                    <Carousel images={banners.map((obj:any) => obj.image.path)}/>
                )
            }
            <div className="container">
                <div className="my-8">
                    <Heading
                        title="Sản phẩm nổi bật"
                        description="Dưới đây là danh sách các sản phẩm nổi bật chúng tôi đề xuất cho bạn."
                    />
                    <div className="mb-16 mt-8">
                    { productTrendings ? (
                        <ProductGrid products={productTrendings}/>
                    ) : (
                        <ProductSkeletonGrid />
                    )}
                    </div>
                    <Heading
                        title="Sản phẩm mới nhất"
                        description="Dưới đây là danh sách các sản phẩm chúng tôi có sẵn cho bạn."
                    />
                   <div className="mb-16 mt-8">
                    {products ? (
                        <ProductGrid products={products} />
                    ) : (
                        <ProductSkeletonGrid />
                    )}
                    <div className="text-center mb-8">
                        <Button variant="outline" onClick={()=>{router.push('/product')}}>
                            Tất cả sản phẩm <ChevronRight className="ml-2 w-4 h-4"/>
                        </Button>   
                    </div>
                    </div>
                    {/* <Heading
                        title="Blog"
                        description="Tin tức, thủ thật"
                    /> */}
                    {/* <div className="my-4">
                    { blogs ? (
                        <BlogGrid blogs={blogs}/>
                    ) : (
                        <BlogSkeletonGrid />
                        )}
                    </div>
                    <div className="text-center">
                        <Button variant="outline">
                            Tất cả bài đăng <ChevronRight className="ml-2 w-4 h-4"/>
                        </Button>   
                    </div> */}
                </div>
            </div>
        </>
    );
};

export default HomePage;