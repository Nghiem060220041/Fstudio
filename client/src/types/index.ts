export type User = {
    id: string;
    name: string;
    phone: string;
    dob: Date;
    gender: string;
    provinceId: string;
    districtId: string;
    wardId: string;
    address: string;
    email: string;
    image: {
        id: string;
        imageable_id: string;
        path: string;
        imageable_type: string
    };
    password: string;
    accessToken: string;
    refreshToken: string;
    active: boolean;
    roleId: string;
}

export type Customer = {
    id: string;
    name: string;
    phone: string;
    provinceId: string;
    districtId: string;
    wardId: string;
    address: string;
    email: string;
    password: string;
    image: {
        id: string;
        imageable_id: string;
        path: string;
        imageable_type: string
    };
    active: boolean
}

export type Role = {
    id: string;
    name: string;
}

export type Province = {
    id: string;
    name: string;
}

export type District = {
    id: string;
    name: string;
    province_id: string;
    province: Province;
}

export type Ward = {
    id: string;
    name: string;
    district_id: string;
    district: District;
}

export type Banner = {
    id: string;
    name: string;
    url: string;
    image: {
        id: string;
        imageable_id: string;
        path: string;
        imageable_type: string
    };
    description: string;
    active: boolean;
    slug: string;
}

export type Category = {
    id: string;
    name: string;
    description: string;
    active: boolean;
    home: boolean;
    slug: string;
}

export type Order = {
    id: string;
    customer_id: string;
    customer: Customer;
    children_orders: Order[];
    total: number;
    createdAt: string;
    paymentAt: string;
    sku_id: string;
    sku: Sku[];
    price: number;
    quantity: number;
    code: string;
    status: string;
    status_code: string;
    status_payment_code: string;
    status_payment: string;
    payment_type: string;
    address: string;
    description: string;
    filename: string;
    class: string;
    classType: string;
    classStatus: string;
}

export type Brand = {
    id: string;
    image: {
        id: string;
        imageable_id: string;
        path: string;
        imageable_type: string
    };
    name: string;
    description: string;
    slug: string;
}

export type Blog = {
    id: string;
    image: {
        id: string;
        imageable_id: string;
        path: string;
        imageable_type: string
    };
    name: string;
    description: string;
    active: boolean;
    slug: string;
}

export type Product = {
    id: string;
    name: string;
    sku: string;
    quantity: number;
    sold_quantity: number;
    brand_id: number;
    category_id: number;
    many_version: boolean;
    price: number;
    active: boolean;
    is_discount: boolean;
    type_discount: number;
    percent_discount: number;
    price_discount: number;
    trending: boolean;
    galleries: ProductGallery[];
    related_products: ProductRelated;
    image: {
        id: string;
        imageable_id: string;
        path: string;
        imageable_type: string
    };
    category: {
        id: string;
        name: string
    };
    brand: {
        id: string;
        name: string
    };
    slug: string;
    description: string;
    skus: Sku[];
    properties: {
        id: string;
        price: string;
        quantity: string;
        property_options: PropertyValueType[];
    }[];
    data: Product;
}

export type ProductRelated = {
    parent_product_id: string;
    child_product_id: string;
    data: Product;
}

export type ProductGallery = {
    id: string;
    product_id: string;
    image: {
        id: string;
        imageable_id: string;
        path: string;
        imageable_type: string
    };
}

export type PropertyValueType = {
    id: number;
    label: string;
    value: string;
    properties: {
      id: number;
      label: string;
      value: string;
    };
  };

export type Property = {
    id: string;
    name: string;
    active: boolean;
    property_options: PropertyOption[];
}

export type PropertyOption = {
    id: string;
    name: string;
    active: boolean;
    property_id: Property;
}

export type Sku = {
    id: string;
    quantity: number;
    sold_quantity: number;
    many_version: boolean;
    price: number;
    is_discount: boolean;
    type_discount: string;
    percent_discount: number;
    price_discount: number;
    product_id: Product
}

export type PropertyOptionSku = {
    sku_id: Sku;
    property_option_id: PropertyOption;
}

export type Cart = {
    id: string;
    slug: string;
    price: number;
    quantity: number;
    image: string;
    name: string;
    sku_id: number | null;
    property_options: PropertyOption[] | null;
}

export type Coupon = {
    id: string;
    code: string;
    name: string;
    description: string;
    type: string;
    value: number;
    expiredDate: string;
    active: boolean;
    quantity: number;
    quantity_used: number;
    value_max: number;
    new_customer: boolean;
    has_expired: boolean;
}
