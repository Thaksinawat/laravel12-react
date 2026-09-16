import { useEffect, useState } from "react";

export default function Quiz4() {

    const [students, setStudents] = useState([]);

    useEffect(() => {
        fetch("/api/students")
            .then(res => res.json())
            .then(data => setStudents(data));
    }, []);

    return (
        <div style={{ padding: "30px" }}>
            <h1>Student List</h1>

            <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Student Code</th>
                        <th>Full Name</th>
                        <th>Department</th>
                        <th>Year</th>
                        <th>Email</th>
                    </tr>
                </thead>

                <tbody>
                    {students.map((student) => (
                        <tr key={student.id}>
                            <td>{student.id}</td>
                            <td>{student.student_code}</td>
                            <td>{student.full_name}</td>
                            <td>{student.department}</td>
                            <td>{student.year}</td>
                            <td>{student.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}