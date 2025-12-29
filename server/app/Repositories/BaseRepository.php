<?php

namespace App\Repositories;

use App\Repositories\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Model;

abstract class BaseRepository implements BaseRepositoryInterface
{
    protected $model;

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    public function getModels()
    {
        return $this->model->all();
    }

    public function getModel($id)
    {
        $result = $this->model->find($id);

        return $result;
    }

    public function store($attributes = [])
    {
        return $this->model->create($attributes);
    }

    public function update($id, $attributes = [])
    {
        $result = $this->getModel($id);
        if ($result) {
            $result->update($attributes);
            return $result;
        }
        return false;
    }

    public function destroy($id)
    {
        $result = $this->getModel($id);
        if ($result) {
            $result->delete();
            return true;
        }
        return false;
    }

    public function paginate($int)
    {
        return $this->model->paginate($int);
    }

    public function count()
    {
        return $this->model->count();
    }

    public function search(?string $key, ?string $value): ?object
    {
        return $this->model->where($key, 'like', '%' . $value . '%')->get();
    }
}
