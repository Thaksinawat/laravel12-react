<?php

namespace Tests\Feature;

use App\Models\Department;
use App\Models\Position;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DepartmentManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_create_department(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/departments', [
            'name' => 'Engineering',
            'manager_name' => 'Alice Johnson',
            'description' => 'Product and engineering unit',
        ]);

        $response
            ->assertStatus(201)
            ->assertJsonPath('data.name', 'Engineering')
            ->assertJsonPath('data.manager_name', 'Alice Johnson');
    }

    public function test_authenticated_user_can_list_departments(): void
    {
        $user = User::factory()->create();

        Department::create([
            'name' => 'Sales',
            'manager_name' => 'Bob Smith',
            'description' => 'Customer sales team',
        ]);

        $response = $this->actingAs($user)->getJson('/api/departments');

        $response
            ->assertOk()
            ->assertJsonFragment(['name' => 'Sales']);
    }

    public function test_authenticated_user_can_create_employee_with_relations(): void
    {
        $user = User::factory()->create();

        $department = Department::create([
            'name' => 'Operations',
            'manager_name' => 'Charlie',
            'description' => 'Operations department',
        ]);

        $position = Position::create([
            'name' => 'Manager',
            'level' => 1,
            'description' => 'Department leadership',
        ]);

        $response = $this->actingAs($user)->postJson('/api/employees', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john.doe@example.com',
            'phone' => '0812345678',
            'department_id' => $department->id,
            'position_id' => $position->id,
            'hire_date' => '2024-01-15',
            'status' => 'active',
        ]);

        $response
            ->assertStatus(201)
            ->assertJsonPath('data.first_name', 'John')
            ->assertJsonPath('data.department_id', $department->id)
            ->assertJsonPath('data.position_id', $position->id);
    }

    public function test_authenticated_web_department_create_redirects_to_index(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/departments', [
            'name' => 'QA Department',
            'manager_name' => 'QA Manager',
            'description' => 'Testing department',
        ]);

        $response->assertRedirect('/departments');
    }
}
