<?php

namespace App\Services\Admin\Brand;

use App\Constants\ImageType;
use App\Models\Brand;
use Illuminate\Support\Facades\Log;
use PHPUnit\TextUI\Configuration\Constant;

class BrandService
{
    protected $brand;

    public function __construct(
        Brand $brand
    ) {
        $this->brand = $brand;
    }

    public function index($params)
    {
        $brands = $this->brand->with('image')->orderBy($params['sort_key'] ?? 'id', $params['order_by'] ?? 'DESC');

        if (isset($params['keywords'])) {
            $brands = $brands->where('name', 'LIKE', '%' . $params['keywords'] . '%');
        }

        if (isset($params['per_page'])) {
            $brands = $brands
                ->paginate(
                    $params['per_page'],
                    ['*'],
                    'page',
                    $params['page'] ?? 1
                );
        } else {
            $brands = $brands->get();
        }

        $brands->map(function ($brand) {
            $brand->name        = limitTo($brand->name, 10);
            $brand->description = limitTo($brand->description, 10);
        });

        return $brands;
    }

    public function show($id)
    {
        $brand = $this->brand->with('image')->find($id);

        return $brand;
    }

    public function getBrandById($id)
    {
        $brand = $this->brand->with('image')->find($id);

        return $brand;
    }

    public function getBrands()
    {
        $brands = $this->brand->orderBy('name', 'asc')->get();

        return $brands;
    }

    public function store($data)
    {
        $brand = $this->brand->create($data);
        if (isset($data['images'])) {
            $dataImage = ['path' => $data['images'][0]['url']];
            $brand->image()->create($dataImage);
        }

        return $brand;
    }

    public function update($id, $data)
    {
        $brand = $this->getBrandById($id);
        if (isset($data['images'][0]['url'])) {
            $brand->image()->delete();
            $dataImage = ['path' => $data['images'][0]['url']];
            $brand->image()->create($dataImage);
        }
        $brand->update($data);

        return $brand;
    }

    public function delete($id)
    {
        $brand = $this->getBrandById($id);
        $brand->image()->delete();
        $brand->delete();

        return $brand;
    }
}
