<?php

namespace App\Repositories;

interface BaseRepositoryInterface
{
    public function getModels();

    public function getModel($id);

    public function store($attributes = []);

    public function update($id, $attributes = []);

    public function destroy($id);

    public function paginate($int);

    public function search(?string $key, ?string $value);
}
