<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Employee;
use App\Models\Position;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $departmentCount = Department::count();
        $employeeCount = Employee::count();
        $positionCount = Position::count();
        $activeEmployees = Employee::where('status', 'active')->count();
        $inactiveEmployees = Employee::where('status', 'inactive')->count();
        $onLeaveEmployees = Employee::where('status', 'on_leave')->count();

        $departments = Department::withCount('employees')->get();
        $departmentBreakdown = $departments
            ->sortByDesc('employees_count')
            ->take(6)
            ->values()
            ->map(fn ($department) => [
                'name' => $department->name,
                'count' => $department->employees_count,
            ]);

        $statusBreakdown = collect([
            ['name' => 'active', 'label' => 'Active', 'count' => $activeEmployees],
            ['name' => 'inactive', 'label' => 'Inactive', 'count' => $inactiveEmployees],
            ['name' => 'on_leave', 'label' => 'On Leave', 'count' => $onLeaveEmployees],
        ])->filter(fn ($item) => $item['count'] > 0)->values();

        return Inertia::render('Dashboard', [
            'stats' => [
                'department_count' => $departmentCount,
                'employee_count' => $employeeCount,
                'position_count' => $positionCount,
                'active_employee_count' => $activeEmployees,
                'inactive_employee_count' => $inactiveEmployees,
                'on_leave_employee_count' => $onLeaveEmployees,
            ],
            'departments' => $departments->map(function ($department) {
                return [
                    'id' => $department->id,
                    'name' => $department->name,
                    'employee_count' => $department->employees_count,
                    'manager_name' => $department->manager_name,
                ];
            }),
            'department_breakdown' => $departmentBreakdown,
            'status_breakdown' => $statusBreakdown,
        ]);
    }
}
