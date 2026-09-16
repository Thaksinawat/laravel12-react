<?php

namespace App\Http\Controllers;

use App\Models\Position;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PositionController extends Controller
{
    public function index(Request $request)
    {
        $payload = Position::all()->map(function ($position) {
            return [
                'id' => $position->id,
                'name' => $position->name,
                'level' => $position->level,
                'description' => $position->description,
                'employee_count' => $position->employees()->count(),
                'created_at' => $position->created_at->format('Y-m-d'),
            ];
        });

        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'data' => $payload,
            ]);
        }

        return Inertia::render('Positions/Index', [
            'positions' => $payload,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'level' => ['required', 'integer', 'min:1'],
            'description' => ['nullable', 'string'],
        ]);

        $position = Position::create($validated);

        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Position created successfully.',
                'data' => $position,
            ], 201);
        }

        return redirect()->route('positions.index');
    }

    public function update(Request $request, Position $position)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'level' => ['required', 'integer', 'min:1'],
            'description' => ['nullable', 'string'],
        ]);

        $position->update($validated);

        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Position updated successfully.',
                'data' => $position->fresh(),
            ]);
        }

        return redirect()->route('positions.index');
    }

    public function destroy(Request $request, Position $position)
    {
        $position->delete();

        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Position deleted successfully.',
            ]);
        }

        return redirect()->route('positions.index');
    }
}
