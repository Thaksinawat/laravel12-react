<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Employee;
use App\Models\Position;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
        ]);

        $engineering = Department::create([
            'name' => 'Engineering',
            'manager_name' => 'Sora Smith',
            'description' => 'Product and technology department',
        ]);

        $sales = Department::create([
            'name' => 'Sales',
            'manager_name' => 'Niran K.',
            'description' => 'Customer acquisition and sales',
        ]);

        $manager = Position::create([
            'name' => 'Manager',
            'level' => 1,
            'description' => 'Department leader',
        ]);

        $developer = Position::create([
            'name' => 'Developer',
            'level' => 2,
            'description' => 'Software engineering',
        ]);

        $support = Position::create([
            'name' => 'Support Specialist',
            'level' => 3,
            'description' => 'Customer support operations',
        ]);

        Employee::create([
            'first_name' => 'Aom',
            'last_name' => 'Patana',
            'email' => 'aom@example.com',
            'phone' => '0811111111',
            'department_id' => $engineering->id,
            'position_id' => $manager->id,
            'hire_date' => '2023-01-05',
            'status' => 'active',
        ]);

        Employee::create([
            'first_name' => 'Bee',
            'last_name' => 'Supap',
            'email' => 'bee@example.com',
            'phone' => '0822222222',
            'department_id' => $engineering->id,
            'position_id' => $developer->id,
            'hire_date' => '2024-04-10',
            'status' => 'active',
        ]);

        Employee::create([
            'first_name' => 'Chai',
            'last_name' => 'Rin',
            'email' => 'chai@example.com',
            'phone' => '0833333333',
            'department_id' => $sales->id,
            'position_id' => $support->id,
            'hire_date' => '2022-09-17',
            'status' => 'on_leave',
        ]);
    }
}
