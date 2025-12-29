<?php

namespace App\Services\Admin\Product;

use App\Models\Product;
use App\Models\PropertyOptionSku;
use App\Models\Sku;
use App\Services\Admin\Category\CategoryService;
use Illuminate\Support\Facades\Log;

class ProductService
{
    protected $product;
    protected $categoryService;
    protected $sku;

    public function __construct(
        Product $product,
        CategoryService $categoryService,
        Sku $sku
    ) {
        $this->product         = $product;
        $this->categoryService = $categoryService;
        $this->sku             = $sku;
    }

    public function index($params)
    {
        $products = $this->product->with('image')->orderBy($params['sort_key'] ?? 'id', $params['order_by'] ?? 'DESC');

        if (isset($params['keywords'])) {
            $products = $products->where('name', 'LIKE', '%' . $params['keywords'] . '%');
        }

        if (isset($params['brand_id'])) {
            $products = $products->where('brand_id', $params['brand_id']);
        }

        if (isset($params['category_id'])) {
            $products = $products->where('category_id', $params['category_id']);
        }

        if (isset($params['active'])) {
            $products = $products->where('active', $params['active']);
        }

        if (isset($params['per_page'])) {
            $products = $products
                ->paginate(
                    $params['per_page'],
                    ['*'],
                    'page',
                    $params['page'] ?? 1
                );
        } else {
            $products = $products->get();
        }

        $products->map(function ($product) {
            $product->name                = limitTo($product->name, 10);
            $product->category_id         = $product->category->name;
            $product->brand_id            = $product->brand->name;
            $product->quantity            = ($product->quantity != null ? $product->quantity : 0) - ($product->sold_quantity != null ? $product->sold_quantity : 0) . " sản phẩm của 1 loại";
            if ($product->many_version == 1) {
                $product->quantity = $product->skus()->sum('quantity') - $product->skus()->sum('sold_quantity') . " sản phẩm của " . $product->skus()->count('id') . " loại";
                $product->price    = $product->skus[0]->price;
            }
            $product->description         = limitTo($product->description, 10);
        });

        return $products;
    }

    public function search($slug, $params, $filteredData)
    {
        $category = $this->categoryService->getCategoryBySlug2($slug);
        $products = $this->product
            ->where('category_id', $category->id)
            ->where('active', config('constant.active'))
            ->with('skus', 'image')
            ->orderBy($params['sort_key'] ?? 'id', $params['order_by'] ?? 'DESC');

        if (isset($params['keywords'])) {
            $products = $products->where('name', 'LIKE', '%' . $params['keywords'] . '%');
        }

        if (isset($params['brand_id'])) {
            $products = $products->where('brand_id', $params['brand_id']);
        }

        if (count($filteredData) > 0) {
            $skuIds = PropertyOptionSku::whereIn('property_option_id', array_values($filteredData))
                ->groupBy('sku_id')
                ->havingRaw('COUNT(DISTINCT property_option_id) = ?', [count(array_values($filteredData))])
                ->pluck('sku_id');
            $productIds = $this->sku
                ->whereIn('id', $skuIds)
                ->distinct('product_id')
                ->pluck('product_id')
                ->toArray();
            $products = $products->whereIn('id', $productIds);
        }

        if (isset($params['per_page'])) {
            $products = $products
                ->paginate(
                    $params['per_page'],
                    ['*'],
                    'page',
                    $params['page'] ?? 1
                );
        } else {
            $products = $products->get();
        }

        $products->map(function ($product) {
            $product->name = limitTo($product->name, 10);
        });

        return $products;
    }

    public function search2($params, $filteredData)
    {
        $products = $this->product
            ->where('active', config('constant.active'))
            ->with('skus', 'image')
            ->orderBy($params['sort_key'] ?? 'id', $params['order_by'] ?? 'DESC');

        if (isset($params['keywords'])) {
            $products = $products->where('name', 'LIKE', '%' . $params['keywords'] . '%');
        }

        if (isset($params['brand_id'])) {
            $products = $products->where('brand_id', $params['brand_id']);
        }

        if (isset($params['category_id'])) {
            $products = $products->where('category_id', $params['category_id']);
        }

        if (count($filteredData) > 0) {
            $skuIds = PropertyOptionSku::whereIn('property_option_id', array_values($filteredData))
                ->groupBy('sku_id')
                ->havingRaw('COUNT(DISTINCT property_option_id) = ?', [count(array_values($filteredData))])
                ->pluck('sku_id');
            $productIds = $this->sku
                ->whereIn('id', $skuIds)
                ->distinct('product_id')
                ->pluck('product_id')
                ->toArray();
            $products = $products->whereIn('id', $productIds);
        }

        if (isset($params['per_page'])) {
            $products = $products
                ->paginate(
                    $params['per_page'],
                    ['*'],
                    'page',
                    $params['page'] ?? 1
                );
        } else {
            $products = $products->get();
        }

        $products->map(function ($product) {
            $product->name = limitTo($product->name, 10);
        });

        return $products;
    }

    public function show($id)
    {
        $product = $this->product
            ->with('image', 'galleries', 'galleries.image')
            ->find($id);

        return $product;
    }

    public function getProductById($id)
    {
        $product = $this->product->with('image', 'galleries', 'relatedProducts', 'galleries.image', 'skus.propertyOptions')->find($id);
        if ($product->many_version == 1) {
            $product->skus->map(function ($sku) {
                $sku->quantity      = $sku->quantity - $sku->sold_quantity;
            });
        } else {
            $product->quantity   = $product->quantity - $product->sold_quantity;
        }
        $product->relatedProducts->map(function ($related) {
            $related->data       = $this->product->with('image')->find($related->child_product_id);
            $related->data->name = limitTo($related->data->name, 6);
        });

        return $product;
    }

    public function getProductBySlug($slug)
    {
        $product = $this->product->with('image', 'galleries', 'relatedProducts', 'galleries.image', 'skus', 'skus.propertyOptions')->where('slug', $slug)->first();
        $product->relatedProducts->map(function ($related) {
            $related->data = $this->product->with('image')->find($related->child_product_id);
            $related->data->name = limitTo($related->data->name, 6);
        });

        return $product;
    }

    public function getProductRelateds($slug)
    {
        $product     = $this->product
            ->where('slug', $slug)
            ->pluck('id')
            ->toArray();
        $categoryId  = $this->product
            ->where('slug', $slug)
            ->first()
            ->category_id;
        $products  = $this->product
            ->whereNotIn('id', $product)
            ->where('category_id', $categoryId)
            ->with('image', 'galleries', 'galleries.image', 'skus', 'skus.propertyOptions')
            ->limit(5)
            ->get();
        $products->map(function ($product) {
            $product->name = limitTo($product->name, 10);
        });

        return $products;
    }

    public function getProductRelatedsPK($id)
    {
        $products = $this->product->with('relatedProducts', 'image')->whereNotIn("id", [$id])->get();

        return $products;
    }

    public function getlistProductTrendings()
    {
        $products    = $this->product
            ->where('trending', 1)
            ->with('image', 'galleries', 'galleries.image', 'category', 'brand', 'skus', 'skus.propertyOptions')
            ->limit(5)
            ->get();
        $products->map(function ($product) {
            $product->name = limitTo($product->name, 10);
        });

        return $products;
    }

    public function getListProducts()
    {
        $products = $this->product->with('image', 'category', 'brand', 'skus')
            ->where('active', config('constant.active'))
            ->orderBy('id', 'desc')
            ->limit(10)
            ->get();
        $products->map(function ($product) {
            $product->name = limitTo($product->name, 10);
        });

        return $products;
    }

    public function store($data)
    {
        $product = $this->product->create($data);
        if (isset($data['images'])) {
            $dataImage = ['path' => $data['images'][0]['url']];
            $product->image()->create($dataImage);
        }

        if ($data['many_version'] == 1) {
            if (isset($data['properties'])) {
                foreach ($data['properties'] as $property) {
                    $skudt = [
                        'product_id'    => $product->id,
                        'sku'           => $product->sku . rand(100000, 999999),
                        'quantity'      => $property['quantity'],
                        'sold_quantity' => 0,
                        'price'         => $property['price'],
                    ];

                    $sku = $product->skus()->create($skudt);
                    foreach ($property['property_options'] as $option) {
                        $opt = [
                            'sku_id'             => $sku->id,
                            'property_option_id' => $option['id'],
                        ];

                        PropertyOptionSku::create($opt);
                    }
                }
            }
        }

        return $product;
    }

    public function related($id, $data)
    {
        $product = $this->getProductById($id);
        if (isset($data['options'])) {
            $product->relatedProducts()->delete();

            foreach ($data['options'] as $dt) {
                $data = ['parent_product_id' => $product->id, 'child_product_id' => $dt['value']];
                $product->relatedProducts()->create($data);
            }
        }
    }

    public function gallery($id, $data)
    {
        $product = $this->getProductById($id);
        if (isset($data['galleries'])) {
            foreach ($product->galleries as $gallery) {
                $gallery->image()->delete();
            }
            $product->galleries()->delete();

            foreach ($data['galleries'] as $path) {
                $dataImage = ['path' => $path['url']];
                $gallery = $product->galleries()->create(['product_id' => $product->id]);
                $gallery->image()->create($dataImage);
            }
        }
    }

    public function update($id, $data)
    {
        $product = $this->getProductById($id);
        if (isset($data['images'][0]['url'])) {
            $product->image()->delete();
            $dataImage = ['path' => $data['images'][0]['url']];
            $product->image()->create($dataImage);
        }
        if ($data['many_version'] == 1) {
            foreach ($product->skus as $sku) {
                $sku->propertyOptions()->detach();
            }
            $product->skus()->delete();
            if (isset($data['properties'])) {
                foreach ($data['properties'] as $property) {
                    $skudt = [
                        'product_id'    => $product->id,
                        'sku'           => $product->sku . rand(100000, 999999),
                        'quantity'      => $property['quantity'],
                        'sold_quantity' => 0,
                        'price'         => $property['price'],
                    ];

                    $sku = $product->skus()->create($skudt);
                    foreach ($property['property_options'] as $option) {
                        $opt = [
                            'sku_id'             => $sku->id,
                            'property_option_id' => $option['id'],
                        ];

                        PropertyOptionSku::create($opt);
                    }
                }
            }
        }
        $product->update($data);

        return $product;
    }

    public function delete($id)
    {
        $product = $this->getProductById($id);
        $product->image()->delete();
        $product->delete();

        return $product;
    }

    public function active($id, $data)
    {
        $product = $this->getProductById($id);
        $product->update(['active' => $data['active']]);

        return $product;
    }
}
