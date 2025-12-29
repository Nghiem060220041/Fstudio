<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Product\CreateRequest;
use App\Http\Requests\Admin\Product\UpdateRequest;
use App\Http\Resources\Product\ProductCollection;
use App\Models\Product;
use App\Models\Property;
use App\Models\PropertyOption;
use App\Models\PropertyOptionSku;
use App\Models\Sku;
use App\Services\Admin\Brand\BrandService;
use App\Services\Admin\Category\CategoryService;
use App\Services\Admin\Product\ProductService;
use App\Services\Admin\Property\PropertyService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Kjmtrue\VietnamZone\Models\District;
use Kjmtrue\VietnamZone\Models\Province;
use Kjmtrue\VietnamZone\Models\Ward;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    protected $productService;
    protected $brandService;
    protected $categoryService;
    protected $propertyService;
    protected $province;
    protected $district;
    protected $ward;

    public function __construct(
        ProductService $productService,
        CategoryService $categoryService,
        PropertyService $propertyService,
        BrandService $brandService,
        Province $province,
        District $district,
        Ward $ward,
    ) {
        $this->middleware("permission:" . config('permissions')['products']['product.list'] .   "|" . config('permissions')['super_admin'] . "|" . config('permissions')['develop'] . "", ['only' => ['index', 'show']]);
        $this->middleware("permission:" . config('permissions')['products']['product.create'] . "|" . config('permissions')['super_admin'] . "|" . config('permissions')['develop'] . "", ['only' => ['store', 'productGalleries']]);
        $this->middleware("permission:" . config('permissions')['products']['product.edit'] .   "|" . config('permissions')['super_admin'] . "|" . config('permissions')['develop'] . "", ['only' => ['update', 'active', 'productGalleries']]);
        $this->middleware("permission:" . config('permissions')['products']['product.delete'] . "|" . config('permissions')['super_admin'] . "|" . config('permissions')['develop'] . "", ['only' => ['destroy']]);

        $this->productService   = $productService;
        $this->categoryService  = $categoryService;
        $this->propertyService  = $propertyService;
        $this->brandService     = $brandService;
        $this->province         = $province;
        $this->district         = $district;
        $this->ward             = $ward;
    }

    public function getListProducts(Request $request)
    {
        try {
            $resultCollection = $this->productService->getListProducts();

            return response()->json([
                'data' => $resultCollection
            ]);
        } catch (\Throwable $e) {
            Log::info($e->getMessage());
        }
    }

    public function getProductDetails($slug)
    {
        try {
            $product = $this->productService->getProductBySlug($slug);

            return response()->json([
                'data' => $product
            ]);
        } catch (\Throwable $e) {
            Log::info($e->getMessage());
        }
    }

    public function getProductRelateds($slug)
    {
        try {
            $product = $this->productService->getProductRelateds($slug);

            return response()->json([
                'data' => $product
            ]);
        } catch (\Throwable $e) {
            Log::info($e->getMessage());
        }
    }

    public function getProductRelatedsPL($slug)
    {
        try {
            $product = $this->productService->getProductRelateds($slug);

            return response()->json([
                'data' => $product
            ]);
        } catch (\Throwable $e) {
            Log::info($e->getMessage());
        }
    }

    public function getlistProductTrendings()
    {
        try {
            $product = $this->productService->getlistProductTrendings();

            return response()->json([
                'data' => $product
            ]);
        } catch (\Throwable $e) {
            Log::info($e->getMessage());
        }
    }

    public function getProductByCategorySlug(Request $request, $slug)
    {
        try {
            $params = [
                'keywords'       => $request->keywords,
                'brand_id'       => $request->brand_id,
                'page'           => $request->page,
                'per_page'       => 12,
                'order_by'       => $request->sort ? explode('.', $request->sort)[1] : null,
                'sort_key'       => $request->sort ? explode('.', $request->sort)[0] : null,
            ];
            $filteredData = [];
            foreach ($request->all() as $key => $value) {
                if ($key !== 'brand_id' && $key !== 'sort') {
                    $filteredData[$key] = $value;
                }
            }

            $resultCollection = $this->productService->search($slug, $params, $filteredData);

            $result = ProductCollection::collection($resultCollection);

            return $result;
        } catch (\Throwable $e) {
            Log::info($e->getMessage());
        }
    }

    public function getAllProducts(Request $request)
    {
        try {
            $params = [
                'keywords'       => $request->keywords,
                'brand_id'       => $request->brand_id,
                'category_id'    => $request->category_id,
                'page'           => (int)$request->page,
                'per_page'       => 100,
                'order_by'       => $request->sort ? explode('.', $request->sort)[1] : null,
                'sort_key'       => $request->sort ? explode('.', $request->sort)[0] : null,
            ];
            $filteredData = [];
            foreach ($request->all() as $key => $value) {
                if ($key !== 'brand_id' && $key !== 'sort' && $key !== 'category_id' && $key !== 'page') {
                    $filteredData[$key] = $value;
                }
            }

            $resultCollection = $this->productService->search2($params, $filteredData);

            $result = ProductCollection::collection($resultCollection);

            return $result;
        } catch (\Throwable $e) {
            Log::info($e->getMessage());
        }
    }

    public function getProductByProperties(Request $request, $slug)
    {
        try {
            $product = $this->productService->getProductBySlug($slug);
            $skuIds = PropertyOptionSku::whereIn('property_option_id', array_values($request->all()))
                ->groupBy('sku_id')
                ->havingRaw('COUNT(DISTINCT property_option_id) = ?', [count(array_values($request->all()))])
                ->pluck('sku_id');

            $skus = Sku::whereIn('id', $skuIds)->where('product_id', $product->id)->with('propertyOptions')->get();

            $options = [];
            foreach ($product->skus as $sku) {
                foreach ($sku->propertyOptions as $option) {
                    $propertyId = $option->property_id;
                    $optionId = $option->id;

                    if (!isset($options[$propertyId])) {
                        $options[$propertyId] = [$optionId];
                    } elseif (!in_array($optionId, $options[$propertyId])) {
                        $options[$propertyId][] = $optionId;
                    }
                }
            }

            $optionFormatted = [];
            foreach ($options as $index => $option) {
                $property_name  = Property::find($index)->name;
                $option_value   = PropertyOption::find($option);

                if (!isset($options[$property_name])) {
                    $optionFormatted[$property_name] = $option_value;
                } else {
                    $optionFormatted[$property_name][] = $option_value;
                }
            }

            return response()->json([
                'data'    => $product,
                'options' => $optionFormatted,
                'newData' => $skus
            ]);
        } catch (\Throwable $e) {
            Log::info($e->getMessage());
        }
    }

    public function option(Request $request)
    {
        try {
            $properties = $this->propertyService->getProperties();

            return response()->json([
                'data' => $properties,
            ]);
        } catch (\Throwable $e) {
            Log::info($e->getMessage());
        }
    }

    public function postProductRelateds(Request $request, $id)
    {
        try {
            $this->productService->related($id, $request->all());

            return response()->json([
                'result'        => 0,
                'message'       => "Thêm mới thành công!",
            ], 200);
        } catch (\Throwable $e) {
            Log::info($e->getMessage());
        }
    }

    public function getProductRelatedsPK(Request $request, $id)
    {
        try {
            $properties = $this->productService->getProductRelatedsPK($id);

            return response()->json([
                'data' => $properties,
            ]);
        } catch (\Throwable $e) {
            Log::info($e->getMessage());
        }
    }

    public function detailOption(Request $request)
    {
        Log::info($request->sku_id);
        try {
            $details = Sku::find($request->sku_id)->with('propertyOptions')->first();
            return response()->json([
                'data' => $details,
            ]);
        } catch (\Throwable $e) {
            Log::info($e->getMessage());
        }
    }

    public function category()
    {
        try {
            $categories = $this->categoryService->getCategories();

            return response()->json([
                'data' => $categories,
            ]);
        } catch (\Throwable $e) {
            Log::info($e->getMessage());
        }
    }

    public function brand()
    {
        try {
            $brands = $this->brandService->getBrands();

            return response()->json([
                'data' => $brands,
            ]);
        } catch (\Throwable $e) {
            Log::info($e->getMessage());
        }
    }

    public function index(Request $request)
    {
        try {
            $params = [
                'keywords'       => $request->keywords,
                'category_id'    => $request->category_id,
                'brand_id'       => $request->brand_id,
                'page'           => $request->page,
                'per_page'       => $request->per_page,
                'order_by'       => $request->order_by,
                'sort_key'       => $request->sort_key,
                'active'         => $request->active,
            ];

            $resultCollection = $this->productService->index($params);

            $result = ProductCollection::collection($resultCollection);

            return $result;
        } catch (\Throwable $e) {
            Log::info($e->getMessage());
        }
    }

    public function store(CreateRequest $request)
    {
        try {
            $data = $request->all();
            $data['slug']   = Str::slug($data['name'], '-');
            $data['active'] = $data['active'] == true ? 1 : 0;
            $data['trending'] = $data['trending'] == true ? 1 : 0;
            $data['many_version'] = $data['many_version'] == true ? 1 : 0;
            $this->productService->store($data);

            return response()->json([
                'result'        => 0,
                'message'       => "Tạo mới thành công!",
            ], 200);
        } catch (\Throwable $th) {
            Log::info($th->getMessage());
        }
    }

    public function show($id)
    {
        $product                 = $this->productService->getProductById($id);
        $product['active']       = $product['active'] === 1 ? true : false;
        $product['trending']     = $product['trending'] == 1 ? true : false;
        $product['many_version'] = $product['many_version'] == 1 ? true : false;

        return response()->json([
            'data'             => $product,
        ]);
    }

    public function update(UpdateRequest $request, $id)
    {
        try {
            $data = $request->all();
            $data['slug']   = Str::slug($data['name'], '-');
            $data['active'] = $data['active'] == true ? 1 : 0;
            $data['trending'] = $data['trending'] == true ? 1 : 0;
            $data['many_version'] = $data['many_version'] == true ? 1 : 0;
            $this->productService->update($id, $data);

            return response()->json([
                'result'        => 0,
                'message'       => "Cập nhật thành công!",
            ], 200);
        } catch (\Throwable $th) {
            Log::info($th->getMessage());
        }
    }

    public function productGalleries(Request $request, $id)
    {
        try {
            $data = $request->all();
            $this->productService->gallery($id, $data);

            return response()->json([
                'result'        => 0,
                'message'       => "Thêm mới thành công!",
            ], 200);
        } catch (\Throwable $th) {
            Log::info($th->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            DB::transaction(function () use ($id) {
                $this->productService->delete($id);
            });

            return response()->json([
                'result'  => 0,
                'message' => "Xoá thành công!",
            ], 200);
        } catch (\Exception $e) {
            Log::info($e->getMessage());
            return $this->errorBack('Đã xảy ra lỗi');
        }
    }

    public function active(Request $request, $id)
    {
        try {
            $data = $request->all();
            $data['active'] = $data['active'] == true ? 1 : 0;
            $this->productService->active($id, $data);

            return response()->json([
                'result'  => 0,
                'message' => "Cập nhật thành công!",
            ], 200);
        } catch (\Exception $e) {
            Log::info($e->getMessage());
            return $this->errorBack('Đã xảy ra lỗi');
        }
    }
}
