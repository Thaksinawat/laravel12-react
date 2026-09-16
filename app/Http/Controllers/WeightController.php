<?php

namespace App\Http\Controllers;

use App\Models\Weight;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WeightController extends Controller
{
    // แสดงหน้า Weight
    public function index()
    {
        $weights = Weight::orderBy('recorded_at', 'asc')->get();

        return Inertia::render('Weights/Index', [
            'weights' => $weights,
        ]);
    }

    // เพิ่มข้อมูลน้ำหนัก
    public function store(Request $request)
    {
        $validated = $request->validate([
            'weight' => 'required|numeric|min:1|max:500',
            'recorded_at' => 'required|date',
        ]);

        Weight::create($validated);

        return redirect()->route('weights.index');
    }

    // แก้ไขข้อมูลน้ำหนัก
    public function update(Request $request, Weight $weight)
    {
        $validated = $request->validate([
            'weight' => 'required|numeric|min:1|max:500',
            'recorded_at' => 'required|date',
        ]);

        $weight->update($validated);

        return redirect()->route('weights.index');
    }

    // ลบข้อมูลน้ำหนัก
    public function destroy(Weight $weight)
    {
        $weight->delete();

        return redirect()->route('weights.index');
    }
}