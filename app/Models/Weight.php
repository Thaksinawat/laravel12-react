<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Weight extends Model
{
    protected $fillable = [
        'weight',
        'recorded_at',
    ];

    protected $casts = [
        'recorded_at' => 'date',
        'weight' => 'decimal:2',
    ];
}