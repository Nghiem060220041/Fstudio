<?php

namespace App\Services\Admin\User;

use App\Constants\ImageType;
use App\Models\Role;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use PHPUnit\TextUI\Configuration\Constant;

class UserService
{
    protected $user;

    public function __construct(
        User $user
    ) {
        $this->user = $user;
    }

    public function index($params)
    {
        $users = $this->user->whereNotIn('id', [1, 2])->with('image')->orderBy($params['sort_key'] ?? 'id', $params['order_by'] ?? 'DESC');

        if (isset($params['keywords'])) {
            $users = $users->where('name', 'LIKE', '%' . $params['keywords'] . '%');
        }

        if (isset($params['active'])) {
            $users = $users->where('active', $params['active']);
        }

        if (isset($params['per_page'])) {
            $users = $users
                ->paginate(
                    $params['per_page'],
                    ['*'],
                    'page',
                    $params['page'] ?? 1
                );
        } else {
            $users = $users->get();
        }

        $users->map(function ($user) {
            $user->name     = limitTo($user->name, 10);
            $user->gender   = $user->gender == 0 ? "Nam" : "Nữ";
            $user->roleId   = Role::find($user->role[0]->id)->name;
        });

        return $users;
    }

    public function show($id)
    {
        $user = $this->user->with('image')->find($id);

        return $user;
    }

    public function getUserById($id)
    {
        $user = $this->user->with('image')->find($id);

        return $user;
    }

    public function getUsers()
    {
        $users = $this->user->orderBy('name', 'asc')->get();

        return $users;
    }

    public function store($data)
    {
        $data['active']             = $data['active'] == true ? 1 : 0;
        $data['password']           = Hash::make($data['password']);
        $data['dob']                = Carbon::parse($data['dob'])->addDays(1)->format('Y-m-d');
        $data['province_id']        = $data['provinceId'];
        $data['district_id']        = $data['districtId'];
        $data['ward_id']            = $data['wardId'];
        $data['role_id']            = isset($data['roleId']) ? $data['roleId'] : '';
        $user = $this->user->create($data);

        if (isset($data['images'])) {
            $dataImage = ['path' => $data['images'][0]['url']];
            $user->image()->create($dataImage);
        }

        $user->syncRoles($data['role_id']);

        return $user;
    }

    public function update($id, $data)
    {
        $user = $this->getUserById($id);
        if(isset($data['password'])){
            $data['password']       = Hash::make($data['password']);
        }
        $data['dob']                = Carbon::parse($data['dob'])->addDays(1)->format('Y-m-d');
        $data['province_id']        = $data['provinceId'];
        $data['district_id']        = $data['districtId'];
        $data['ward_id']            = $data['wardId'];
        $data['role_id']            = isset($data['roleId']) ? $data['roleId'] : '';

        if (isset($data['images'][0]['url'])) {
            $user->image()->delete();
            $dataImage = ['path' => $data['images'][0]['url']];
            $user->image()->create($dataImage);
        }
        $user->update($data);
        $user->syncRoles($data['role_id']);

        return $user;
    }

    public function delete($id)
    {
        $user = $this->getUserById($id);
        $user->image()->delete();
        $user->delete();

        return $user;
    }
}
