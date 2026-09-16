<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => bcrypt('password'),
            ]
        );

        DB::table('students')->insertOrIgnore([
            [
                'student_code' => '66010001',
                'full_name' => 'สมชาย ใจดี',
                'department' => 'เทคโนโลยีสารสนเทศ',
                'year' => 1,
                'email' => 'somchai@email.com',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'student_code' => '66010002',
                'full_name' => 'สมหญิง พรดี',
                'department' => 'วิทยาการคอมพิวเตอร์',
                'year' => 2,
                'email' => 'somying@email.com',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'student_code' => '66010003',
                'full_name' => 'กิตติศักดิ์ แก้วดี',
                'department' => 'เทคโนโลยีสารสนเทศ',
                'year' => 3,
                'email' => 'kitti@email.com',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'student_code' => '66010004',
                'full_name' => 'นภัสสร สุขใจ',
                'department' => 'คอมพิวเตอร์ธุรกิจ',
                'year' => 2,
                'email' => 'napat@email.com',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'student_code' => '66010005',
                'full_name' => 'ธนกฤต บุญมาก',
                'department' => 'วิทยาการคอมพิวเตอร์',
                'year' => 4,
                'email' => 'thanakrit@email.com',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
