import { useState } from "react";
import { useForm } from "@inertiajs/react";

export default function Index({ weights }) {
    const [editing, setEditing] = useState(null);

    const form = useForm({
        weight: "",
        recorded_at: "",
    });

    // เพิ่มข้อมูล
    const submitCreate = (e) => {
        e.preventDefault();

        form.post("/weights", {
            onSuccess: () => {
                form.reset();
            },
        });
    };

    // แก้ไขข้อมูล
    const startEdit = (item) => {
        setEditing(item.id);

        form.setData({
            weight: item.weight,
            recorded_at: item.recorded_at.substring(0, 10),
        });
    };

    const submitEdit = (e) => {
        e.preventDefault();

        form.put(`/weights/${editing}`, {
            onSuccess: () => {
                setEditing(null);
                form.reset();
            },
        });
    };

    // ลบข้อมูล
    const deleteWeight = (id) => {
        if (confirm("ต้องการลบข้อมูลน้ำหนักนี้หรือไม่?")) {
            form.delete(`/weights/${id}`);
        }
    };

    // หาค่าน้ำหนักสูงสุดและต่ำสุดสำหรับกราฟ
    const maxWeight =
        weights.length > 0
            ? Math.max(...weights.map((item) => Number(item.weight)))
            : 100;

    const minWeight =
        weights.length > 0
            ? Math.min(...weights.map((item) => Number(item.weight)))
            : 0;

    return (
        <div
            style={{
                padding: "30px",
                maxWidth: "1000px",
                margin: "auto",
                fontFamily: "Arial",
            }}
        >
            <h1>⚖️ ระบบบันทึกน้ำหนัก</h1>

            {/* Form */}
            <div
                style={{
                    background: "#f5f5f5",
                    padding: "20px",
                    borderRadius: "10px",
                    marginBottom: "30px",
                }}
            >
                <h2>
                    {editing
                        ? "✏️ แก้ไขข้อมูลน้ำหนัก"
                        : "➕ เพิ่มข้อมูลน้ำหนัก"}
                </h2>

                <form
                    onSubmit={editing ? submitEdit : submitCreate}
                    style={{
                        display: "flex",
                        gap: "10px",
                        flexWrap: "wrap",
                    }}
                >
                    <div>
                        <label>น้ำหนัก (kg)</label>
                        <br />

                        <input
                            type="number"
                            step="0.01"
                            value={form.data.weight}
                            onChange={(e) =>
                                form.setData("weight", e.target.value)
                            }
                            placeholder="เช่น 65.50"
                            style={{
                                padding: "10px",
                                width: "180px",
                            }}
                        />

                        {form.errors.weight && (
                            <div style={{ color: "red" }}>
                                {form.errors.weight}
                            </div>
                        )}
                    </div>

                    <div>
                        <label>วันที่บันทึก</label>
                        <br />

                        <input
                            type="date"
                            value={form.data.recorded_at}
                            onChange={(e) =>
                                form.setData("recorded_at", e.target.value)
                            }
                            style={{
                                padding: "10px",
                            }}
                        />

                        {form.errors.recorded_at && (
                            <div style={{ color: "red" }}>
                                {form.errors.recorded_at}
                            </div>
                        )}
                    </div>

                    <div style={{ alignSelf: "end" }}>
                        <button
                            type="submit"
                            disabled={form.processing}
                            style={{
                                padding: "10px 20px",
                                background: "#2563eb",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}
                        >
                            {editing ? "บันทึกการแก้ไข" : "เพิ่มน้ำหนัก"}
                        </button>

                        {editing && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditing(null);
                                    form.reset();
                                }}
                                style={{
                                    marginLeft: "10px",
                                    padding: "10px 20px",
                                }}
                            >
                                ยกเลิก
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* กราฟ */}
            <div
                style={{
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    padding: "20px",
                    marginBottom: "30px",
                }}
            >
                <h2>📈 กราฟน้ำหนัก</h2>

                {weights.length === 0 ? (
                    <p>ยังไม่มีข้อมูลสำหรับแสดงกราฟ</p>
                ) : (
                    <div>
                        <svg
                            width="100%"
                            height="300"
                            viewBox="0 0 800 300"
                            preserveAspectRatio="none"
                        >
                            {/* เส้นพื้นฐาน */}
                            <line
                                x1="50"
                                y1="250"
                                x2="780"
                                y2="250"
                                stroke="#999"
                            />

                            <line
                                x1="50"
                                y1="30"
                                x2="50"
                                y2="250"
                                stroke="#999"
                            />

                            {/* เส้นกราฟ */}
                            {weights.length > 1 &&
                                weights.map((item, index) => {
                                    if (index === 0) return null;

                                    const previous = weights[index - 1];

                                    const x1 =
                                        50 +
                                        ((index - 1) /
                                            Math.max(weights.length - 1, 1)) *
                                            730;

                                    const x2 =
                                        50 +
                                        (index /
                                            Math.max(weights.length - 1, 1)) *
                                            730;

                                    const y1 =
                                        250 -
                                        ((Number(previous.weight) -
                                            minWeight +
                                            5) /
                                            (maxWeight -
                                                minWeight +
                                                10)) *
                                            200;

                                    const y2 =
                                        250 -
                                        ((Number(item.weight) -
                                            minWeight +
                                            5) /
                                            (maxWeight -
                                                minWeight +
                                                10)) *
                                            200;

                                    return (
                                        <line
                                            key={item.id}
                                            x1={x1}
                                            y1={y1}
                                            x2={x2}
                                            y2={y2}
                                            stroke="blue"
                                            strokeWidth="3"
                                        />
                                    );
                                })}

                            {/* จุดข้อมูล */}
                            {weights.map((item, index) => {
                                const x =
                                    50 +
                                    (index /
                                        Math.max(weights.length - 1, 1)) *
                                        730;

                                const y =
                                    250 -
                                    ((Number(item.weight) -
                                        minWeight +
                                        5) /
                                        (maxWeight - minWeight + 10)) *
                                        200;

                                return (
                                    <g key={item.id}>
                                        <circle
                                            cx={x}
                                            cy={y}
                                            r="6"
                                            fill="blue"
                                        />

                                        <text
                                            x={x}
                                            y={y - 10}
                                            textAnchor="middle"
                                            fontSize="12"
                                        >
                                            {item.weight}
                                        </text>
                                    </g>
                                );
                            })}
                        </svg>
                    </div>
                )}
            </div>

            {/* ตารางข้อมูล */}
            <h2>📋 ข้อมูลน้ำหนัก</h2>

            {weights.length === 0 ? (
                <p>ยังไม่มีข้อมูลน้ำหนัก</p>
            ) : (
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                    }}
                >
                    <thead>
                        <tr style={{ background: "#eee" }}>
                            <th style={{ padding: "10px" }}>วันที่</th>
                            <th style={{ padding: "10px" }}>น้ำหนัก</th>
                            <th style={{ padding: "10px" }}>จัดการ</th>
                        </tr>
                    </thead>

                    <tbody>
                        {weights.map((item) => (
                            <tr key={item.id}>
                                <td
                                    style={{
                                        padding: "10px",
                                        textAlign: "center",
                                        borderBottom: "1px solid #ddd",
                                    }}
                                >
                                    {item.recorded_at}
                                </td>

                                <td
                                    style={{
                                        padding: "10px",
                                        textAlign: "center",
                                        borderBottom: "1px solid #ddd",
                                    }}
                                >
                                    {item.weight} kg
                                </td>

                                <td
                                    style={{
                                        padding: "10px",
                                        textAlign: "center",
                                        borderBottom: "1px solid #ddd",
                                    }}
                                >
                                    <button
                                        onClick={() => startEdit(item)}
                                        style={{
                                            marginRight: "10px",
                                            padding: "7px 15px",
                                        }}
                                    >
                                        ✏️ แก้ไข
                                    </button>

                                    <button
                                        onClick={() =>
                                            deleteWeight(item.id)
                                        }
                                        style={{
                                            padding: "7px 15px",
                                        }}
                                    >
                                        🗑️ ลบ
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}