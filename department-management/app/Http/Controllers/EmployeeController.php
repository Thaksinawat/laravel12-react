<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Employee;
use App\Models\Position;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $employees = Employee::with(['department', 'position'])->get()->map(function ($employee) {
            return [
                'id' => $employee->id,
                'first_name' => $employee->first_name,
                'last_name' => $employee->last_name,
                'full_name' => $employee->first_name . ' ' . $employee->last_name,
                'email' => $employee->email,
                'phone' => $employee->phone,
                'department_id' => $employee->department_id,
                'department_name' => $employee->department?->name,
                'position_id' => $employee->position_id,
                'position_name' => $employee->position?->name,
                'hire_date' => $employee->hire_date,
                'status' => $employee->status,
            ];
        });

        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'data' => $employees,
            ]);
        }

        return Inertia::render('Employees/Index', [
            'employees' => $employees,
            'departments' => Department::select('id', 'name')->get(),
            'positions' => Position::select('id', 'name')->get(),
        ]);
    }

    public function exportCsv()
    {
        $employees = Employee::with(['department', 'position'])->get();

        $csv = fopen('php://temp', 'w+');
        fputcsv($csv, ['Name', 'Email', 'Department', 'Position', 'Status']);

        foreach ($employees as $employee) {
            fputcsv($csv, [
                $employee->first_name . ' ' . $employee->last_name,
                $employee->email,
                $employee->department?->name ?? '-',
                $employee->position?->name ?? '-',
                $employee->status,
            ]);
        }

        rewind($csv);
        $content = stream_get_contents($csv);
        fclose($csv);

        return response($content)
            ->header('Content-Type', 'text/csv; charset=utf-8')
            ->header('Content-Disposition', 'attachment; filename="employees.csv"');
    }

    public function exportPdf()
    {
        $employees = Employee::with(['department', 'position'])
            ->orderBy('first_name')
            ->get();

        return response()->view('employees.report', [
            'employees' => $employees,
        ])->header('Content-Type', 'text/html; charset=utf-8');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:employees,email'],
            'phone' => ['nullable', 'string', 'max:20'],
            'department_id' => ['required', 'exists:departments,id'],
            'position_id' => ['required', 'exists:positions,id'],
            'hire_date' => ['required', 'date'],
            'status' => ['required', 'in:active,inactive,on_leave'],
        ]);

        $employee = Employee::create($validated);

        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Employee created successfully.',
                'data' => $employee->load(['department', 'position']),
            ], 201);
        }

        return redirect()->route('employees.index');
    }

    public function update(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:employees,email,' . $employee->id],
            'phone' => ['nullable', 'string', 'max:20'],
            'department_id' => ['required', 'exists:departments,id'],
            'position_id' => ['required', 'exists:positions,id'],
            'hire_date' => ['required', 'date'],
            'status' => ['required', 'in:active,inactive,on_leave'],
        ]);

        $employee->update($validated);

        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Employee updated successfully.',
                'data' => $employee->fresh()->load(['department', 'position']),
            ]);
        }

        return redirect()->route('employees.index');
    }

    public function destroy(Request $request, Employee $employee)
    {
        $employee->delete();

        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Employee deleted successfully.',
            ]);
        }

        return redirect()->route('employees.index');
    }
}
