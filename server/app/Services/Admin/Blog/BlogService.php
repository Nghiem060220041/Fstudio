<?php

namespace App\Services\Admin\Blog;

use App\Models\Blog;

class BlogService
{
    protected $blog;

    public function __construct(
        Blog $blog
    ) {
        $this->blog = $blog;
    }

    public function index($params)
    {
        $blogs = $this->blog->with('image')->orderBy($params['sort_key'] ?? 'id', $params['order_by'] ?? 'DESC');

        if (isset($params['keywords'])) {
            $blogs = $blogs->where('name', 'LIKE', '%' . $params['keywords'] . '%');
        }

        if (isset($params['per_page'])) {
            $blogs = $blogs
                ->paginate(
                    $params['per_page'],
                    ['*'],
                    'page',
                    $params['page'] ?? 1
                );
        } else {
            $blogs = $blogs->get();
        }

        $blogs->map(function ($blog) {
            $blog->name        = limitTo($blog->name, 10);
            $blog->description = limitTo($blog->description, 10);
        });

        return $blogs;
    }

    public function show($id)
    {
        $blog = $this->blog->with('image')->find($id);

        return $blog;
    }

    public function getBlogById($id)
    {
        $blog = $this->blog->with('image')->find($id);

        return $blog;
    }

    public function getBlogs()
    {
        $blogs = $this->blog->orderBy('name', 'asc')->get();

        return $blogs;
    }

    public function store($data)
    {
        $blog = $this->blog->create($data);
        if (isset($data['images'])) {
            $dataImage = ['path' => $data['images'][0]['url']];
            $blog->image()->create($dataImage);
        }

        return $blog;
    }

    public function update($id, $data)
    {
        $blog = $this->getBlogById($id);
        if (isset($data['images'][0]['url'])) {
            $blog->image()->delete();
            $dataImage = ['path' => $data['images'][0]['url']];
            $blog->image()->create($dataImage);
        }
        $blog->update($data);

        return $blog;
    }

    public function delete($id)
    {
        $blog = $this->getBlogById($id);
        $blog->image()->delete();
        $blog->delete();

        return $blog;
    }
}
