<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    public function index(Request $request)
    {
        $payload = Department::all()->map(function ($department) {
            return [
                'id' => $department->id,
                'name' => $department->name,
                'manager_name' => $department->manager_name,
                'description' => $department->description,
                'employee_count' => $department->employees()->count(),
                'created_at' => $department->created_at->format('Y-m-d'),
            ];
        });

        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'data' => $payload,
            ]);
        }

        return Inertia::render('Departments/Index', [
            'departments' => $payload,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'manager_name' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $department = Department::create($validated);

        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Department created successfully.',
                'data' => $department,
            ], 201);
        }

        return redirect()->route('departments.index');
    }

    public function update(Request $request, Department $department)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'manager_name' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $department->update($validated);

        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Department updated successfully.',
                'data' => $department->fresh(),
            ]);
        }

        return redirect()->route('departments.index');
    }

    public function destroy(Request $request, Department $department)
    {
        $department->delete();

        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Department deleted successfully.',
            ]);
        }

        return redirect()->route('departments.index');
    }
}
