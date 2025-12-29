<?php

namespace App\Services\Admin\Category;

use App\Models\Category;
use Illuminate\Support\Facades\Log;

class CategoryService
{
    protected $category;

    public function __construct(
        Category $category
    ) {
        $this->category = $category;
    }

    public function index($params)
    {
        $categories = $this->category->orderBy($params['sort_key'] ?? 'id', $params['order_by'] ?? 'DESC');

        if (isset($params['keywords'])) {
            $categories = $categories->where('name', 'LIKE', '%' . $params['keywords'] . '%');
        }

        if (isset($params['active'])) {
            $categories = $categories->where('active', $params['active']);
        }

        if (isset($params['per_page'])) {
            $categories = $categories
                ->paginate(
                    $params['per_page'],
                    ['*'],
                    'page',
                    $params['page'] ?? 1
                );
        } else {
            $categories = $categories->get();
        }

        $categories->map(function ($category) {
            $category->name        = limitTo($category->name, 10);
            $category->description = limitTo($category->description, 10);
        });

        return $categories;
    }

    public function getCategoriesBySlug($slug)
    {
        $category = $this->getCategoryBySlug($slug);

        return $category->products;
    }

    public function show($id)
    {
        $category = $this->category->find($id);

        return $category;
    }

    public function getCategoryById($id)
    {
        $category = $this->category->find($id);

        return $category;
    }

    public function getCategoryMenubar()
    {
        $category = $this->category
            ->where('active', config('constant.active'))
            ->where('home', config('constant.active'))
            ->limit(6)
            ->get();

        return $category;
    }

    public function getCategoryBySlug($slug)
    {
        $category = $this->category->where('slug', $slug)->with('products.skus', 'products.image')->first();

        return $category;
    }

    public function getCategoryBySlug2($slug)
    {
        $category = $this->category->where('slug', $slug)->first();

        return $category;
    }

    public function getCategories()
    {
        $categories = $this->category->where('active', config('constant.active'))->orderBy('name', 'asc')->get();

        return $categories;
    }

    public function store($data)
    {
        $category = $this->category->create($data);

        return $category;
    }

    public function update($id, $data)
    {
        $category = $this->getCategoryById($id);
        $category->update($data);

        return $category;
    }

    public function delete($id)
    {
        $category = $this->getCategoryById($id);
        $category->delete();

        return $category;
    }

    public function active($id, $data)
    {
        $category = $this->getCategoryById($id);
        $category->update(['active' => $data['active']]);

        return $category;
    }
}
