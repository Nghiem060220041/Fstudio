<?php

namespace App\Services\Admin\Property;

use App\Models\Property;

class PropertyService
{
    protected $property;

    public function __construct(
        Property $property
    ) {
        $this->property = $property;
    }

    public function index($params)
    {
        $properties = $this->property->orderBy($params['sort_key'] ?? 'id', $params['order_by'] ?? 'DESC');

        if (isset($params['keywords'])) {
            $properties = $properties->where('name', 'LIKE', '%' . $params['keywords'] . '%');
        }

        if (isset($params['active'])) {
            $properties = $properties->where('active', $params['active']);
        }

        if (isset($params['per_page'])) {
            $properties = $properties
                ->paginate(
                    $params['per_page'],
                    ['*'],
                    'page',
                    $params['page'] ?? 1
                );
        } else {
            $properties = $properties->get();
        }

        $properties->map(function ($property) {
            $property->name        = limitTo($property->name, 10);
        });

        return $properties;
    }

    public function show($id)
    {
        $property = $this->property->find($id);

        return $property;
    }

    public function getPropertyById($id)
    {
        $property = $this->property->find($id);

        return $property;
    }

    public function getProperties()
    {
        $properties = $this->property->with('propertyOptions')->orderBy('id', 'asc')->get();

        return $properties;
    }

    public function store($data)
    {
        $property = $this->property->create($data);

        return $property;
    }

    public function update($id, $data)
    {
        $property = $this->getPropertyById($id);
        $property->update($data);

        return $property;
    }

    public function delete($id)
    {
        $property = $this->getPropertyById($id);
        $property->delete();

        return $property;
    }

    public function active($id, $data)
    {
        $product = $this->getPropertyById($id);
        $product->update(['active' => $data['active']]);

        return $product;
    }
}
