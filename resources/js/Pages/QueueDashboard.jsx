import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';

export default function QueueDashboard({ initialQueue }) {
    // ==========================================
    // 1. ส่วนของ STATE (จัดการสถานะในหน้าจอ)
    // ==========================================
    
    // UI State: ใช้สำหรับสลับแท็บหน้าจอระหว่าง 'status' (สถานะคิว) กับ 'menu' (เมนูอาหาร)
    const [activeTab, setActiveTab] = useState('status');
    
    // UI State: ใช้ควบคุมการ เปิด (true) / ปิด (false) กล่องข้อความยืนยันยกเลิกคิว
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

    // Data State: นำข้อมูลเริ่มต้นที่ได้มาจาก Laravel มาเก็บใน State เพื่อให้พร้อมอัปเดต
    const [queueData, setQueueData] = useState(initialQueue);

    // ==========================================
    // 2. ส่วนของ LOGIC & EFFECT
    // ==========================================
    
    // ทำงานอัตโนมัติเมื่อเข้าหน้านี้: สั่งดึงข้อมูลคิวล่าสุดจาก Laravel เบื้องหลังทุกๆ 10 วินาที
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({
                only: ['initialQueue'], // ดึงเฉพาะข้อมูลคิวใหม่ ไม่ดาวน์โหลดหน้าเว็บใหม่ทั้งหมด
                onSuccess: (page) => {
                    // เมื่อ Laravel ส่งข้อมูลคิวใหม่มา ให้อัปเดตใส่ State ทันที หน้าจอจะเปลี่ยนเลขตาม
                    setQueueData(page.props.initialQueue);
                }
            });
        }, 10000); 

        return () => clearInterval(interval);
    }, []);

    // ฟังก์ชันเมื่อผู้ใช้กดยืนยัน "ยกเลิกคิว"
    const handleCancelQueue = () => {
        router.post(`/queue/cancel/${queueData.id}`, {}, {
            onSuccess: () => {
                setIsCancelModalOpen(false); // ปิดหน้าต่าง Modal หลังจากยกเลิกสำเร็จ
                alert('ยกเลิกคิวของคุณเรียบร้อยแล้ว');
            }
        });
    };

    // ==========================================
    // 3. ส่วนของ UI (HTML / JSX)
    // ==========================================
    return (
        <div style={styles.container}>
            <Head title="สถานะคิวร้านอาหาร" />
            
            <div style={styles.card}>
                <h1 style={styles.title}>คิวของคุณ: <span style={styles.highlight}>{queueData.queue_number}</span></h1>
                <p style={styles.subtitle}>จำนวนคิวที่ต้องรอ: <span style={styles.badge}>{queueData.waiting_count}</span> คิว</p>
                
                {/* แท็บปุ่มกด: เปลี่ยนค่า activeTab State เมื่อคลิก */}
                <div style={styles.tabGroup}>
                    <button 
                        style={{...styles.tabButton, fontWeight: activeTab === 'status' ? 'bold' : 'normal'}}
                        onClick={() => setActiveTab('status')}
                    >
                        ดูสถานะคิว
                    </button>
                    <button 
                        style={{...styles.tabButton, fontWeight: activeTab === 'menu' ? 'bold' : 'normal'}}
                        onClick={() => setActiveTab('menu')}
                    >
                        ดูเมนูระหว่างรอ
                    </button>
                </div>

                {/* การใช้ State เพื่อเลือกว่าจะแสดงผลเนื้อหาอะไร */}
                {activeTab === 'status' ? (
                    <div>
                        <p>เวลารอโดยประมาณ: <b>{queueData.estimated_time} นาที</b></p>
                        <button onClick={() => setIsCancelModalOpen(true)} style={styles.btnDanger}>
                            ยกเลิกการจองคิวนี้
                        </button>
                    </div>
                ) : (
                    <div style={styles.menuList}>
                        <p><b>เมนูแนะนำ:</b></p>
                        <ul>
                            <li>🍣 แซลมอนซาชิมิ</li>
                            <li>🍜 ทงคตสึราเมน</li>
                        </ul>
                    </div>
                )}
            </div>

            {/* Modal ยืนยัน: จะยอมให้เรนเดอร์บนหน้าจอต่อเมื่อ State isCancelModalOpen เป็น true เท่านั้น */}
            {isCancelModalOpen && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h3>คุณต้องการยกเลิกคิวนี้ใช่หรือไม่?</h3>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button onClick={handleCancelQueue} style={styles.btnDanger}>ใช่, ยกเลิกคิว</button>
                            <button onClick={() => setIsCancelModalOpen(false)} style={styles.btnSecondary}>ย้อนกลับ</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// สไตล์ CSS แบบ Inline อย่างง่ายเพื่อให้โค้ดพร้อมแสดงผลสวยงามทันที
const styles = {
    container: { display: 'flex', justifyContent: 'center', padding: '40px', fontFamily: 'sans-serif', backgroundColor: '#f3f4f6', minHeight: '100vh' },
    card: { backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' },
    title: { fontSize: '24px', margin: '0 0 10px 0' },
    highlight: { color: '#2563eb' },
    subtitle: { fontSize: '16px', color: '#4b5563' },
    badge: { color: '#dc2626', fontSize: '20px', fontWeight: 'bold' },
    tabGroup: { display: 'flex', borderBottom: '1px solid #e5e7eb', margin: '20px 0' },
    tabButton: { flex: 1, padding: '10px', border: 'none', background: 'none', cursor: 'pointer' },
    menuList: { textAlign: 'left', backgroundColor: '#f9fafb', padding: '15px', borderRadius: '8px' },
    btnDanger: { backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', width: '100%', marginTop: '15px' },
    btnSecondary: { backgroundColor: '#e5e7eb', color: '#1f2937', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', width: '100%', marginTop: '15px' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' },
    modalContent: { backgroundColor: '#fff', padding: '25px', borderRadius: '8px', maxWidth: '300px', width: '100%', textAlign: 'center' }
};