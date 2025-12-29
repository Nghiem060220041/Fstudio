<?php

namespace App\Services\Admin\Banner;

use App\Models\Banner;
use Illuminate\Support\Facades\Log;

class BannerService
{
    protected $banner;

    public function __construct(
        Banner $banner
    ) {
        $this->banner = $banner;
    }

    public function index($params)
    {
        $banners = $this->banner->with('image')->orderBy($params['sort_key'] ?? 'id', $params['order_by'] ?? 'DESC');

        if (isset($params['keywords'])) {
            $banners = $banners->where('name', 'LIKE', '%' . $params['keywords'] . '%');
        }

        if (isset($params['per_page'])) {
            $banners = $banners
                ->paginate(
                    $params['per_page'],
                    ['*'],
                    'page',
                    $params['page'] ?? 1
                );
        } else {
            $banners = $banners->get();
        }

        if (isset($params['active'])) {
            $banners = $banners->where('active', $params['active']);
        }

        $banners->map(function ($banner) {
            $banner->name        = limitTo($banner->name, 10);
            $banner->description = limitTo($banner->description, 10);
        });

        return $banners;
    }

    public function show($id)
    {
        $banner = $this->banner->with('image')->find($id);

        return $banner;
    }

    public function getBannerById($id)
    {
        $banner = $this->banner->with('image')->find($id);

        return $banner;
    }

    public function getBanners()
    {
        $banner = $this->banner->where('active', config('constant.active'))->with('image')->get();

        return $banner;
    }

    public function store($data)
    {
        $banner = $this->banner->create($data);
        if (isset($data['images'])) {
            $dataImage = ['path' => $data['images'][0]['url']];
            $banner->image()->create($dataImage);
        }

        return $banner;
    }

    public function update($id, $data)
    {
        $banner = $this->getBannerById($id);
        if (isset($data['images'][0]['url'])) {
            $banner->image()->delete();
            $dataImage = ['path' => $data['images'][0]['url']];
            $banner->image()->create($dataImage);
        }
        $banner->update($data);

        return $banner;
    }

    public function active($id, $data)
    {
        $banner = $this->getBannerById($id);
        $banner->update(['active' => $data['active']]);

        return $banner;
    }

    public function delete($id)
    {
        $banner = $this->getBannerById($id);
        $banner->image()->delete();
        $banner->delete();

        return $banner;
    }
}
