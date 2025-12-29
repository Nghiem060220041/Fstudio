<?php

namespace App\Services\Admin\Property;

use App\Models\PropertyOption;

class OptionService
{
    protected $option;

    public function __construct(
        PropertyOption $option
    ) {
        $this->option = $option;
    }

    public function index($params, $propertyId)
    {
        $options = $this->option->where('property_id', $propertyId)->orderBy($params['sort_key'] ?? 'id', $params['order_by'] ?? 'DESC');

        if (isset($params['keywords'])) {
            $options = $options->where('name', 'LIKE', '%' . $params['keywords'] . '%');
        }

        if (isset($params['active'])) {
            $options = $options->where('active', $params['active']);
        }

        if (isset($params['per_page'])) {
            $options = $options
                ->paginate(
                    $params['per_page'],
                    ['*'],
                    'page',
                    $params['page'] ?? 1
                );
        } else {
            $options = $options->get();
        }

        $options->map(function ($option) {
            $option->name           = limitTo($option->name, 10);
            $option->property_id    = limitTo($option->property->name, 10);
        });

        return $options;
    }

    public function show($id)
    {
        $option = $this->option->find($id);

        return $option;
    }

    public function getOptionById($id)
    {
        $option = $this->option->find($id);

        return $option;
    }

    public function getOptions()
    {
        $options = $this->option->orderBy('name', 'asc')->get();

        return $options;
    }

    public function store($data)
    {
        $option = $this->option->create($data);

        return $option;
    }

    public function update($id, $data)
    {
        $option = $this->getOptionById($id);
        $option->update($data);

        return $option;
    }

    public function delete($id)
    {
        $option = $this->getOptionById($id);
        $option->delete();

        return $option;
    }
}
