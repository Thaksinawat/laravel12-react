<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class QueueController extends Controller
{
    // ฟังก์ชันสำหรับแสดงหน้าแดชบอร์ดคิว
    public function show($id)
    {
        // ในระบบจริง: $queue = Queue::findOrFail($id);
        // จำลองข้อมูลคิวเพื่อส่งไปให้ฝั่ง React (สุ่มตัวเลขคิวรอ เพื่อให้เห็นการอัปเดตแบบ State)
        $mockQueueData = [
            'id' => $id,
            'queue_number' => 'A05',
            'waiting_count' => rand(2, 5), // ทุกครั้งที่รีโหลด คิวจะสุ่มลดลง/เปลี่ยนไปเพื่อจำลอง Real-time
            'estimated_time' => 15,
        ];

        // ส่งข้อมูลไปยังหน้าเว็บ React ชื่อ "QueueDashboard"
        return Inertia::render('QueueDashboard', [
            'initialQueue' => $mockQueueData
        ]);
    }

    // ฟังก์ชันจัดการเมนูกดยกเลิกคิว
    public function cancel($id)
    {
        // ในระบบจริง: Queue::destroy($id);
        
        // เมื่อทำงานเสร็จ จะสั่งให้ระบบวิ่งกลับไปที่หน้าเดิมพร้อมข้อมูลอัปเดตล่าสุด
        return back();
    }
}