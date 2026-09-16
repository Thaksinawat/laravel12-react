<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Product;
use App\Models\Student;
use App\Http\Controllers\Api\ProductController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/product', function () {
    $products = Product::all(); // Fetch all products
    return response()->json($products); // Return as JSON
});

//quiz4
Route::get('/students', function () {
    return Student::all();
}); 
Route::apiResource('/product', ProductController::class);