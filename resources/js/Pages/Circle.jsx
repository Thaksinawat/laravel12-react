import BootstrapLayout from "@/layouts/BootstrapLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";

export default function Circle() {
    const [items, setItems] = useState([1,1,1,1,1,1,1,1]);
    const [color, setColor] = useState("blue");

    const onPressButton = () => { setColor("red"); };  

    return (
        <BootstrapLayout>
            <div className="container">
                <Head title="Circle and state" />
                <h1>Circle and state</h1>
                <button className="btn btn-primary" onClick={onPressButton}> Change Color </button>
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {items.map((item, index) => (
                        <div className="col">
                            <div style={{ backgroundColor : color, width:100, height:100 }} className="rounded-circle"></div>
                        </div>
                    ))}
                </div>                
            </div>
        </BootstrapLayout>
    );
}

//resources/js/Pages/Counter.jsx
import BootstrapLayout from "@/layouts/BootstrapLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";

export default function Counter() {

    const [count, setCount] = useState(0);

    const increment = () => setCount(count + 1);
    const decrement = () => setCount(count - 1);
    const reset = () => setCount(0);

    return (
        <BootstrapLayout>                      
            <Head title="Counter"/>
            <div className="container mt-4">
                <h1>Counter App</h1>                
                <h5 className="text-center bg-info fs-1">{count}</h5>
                <div className="row text-center">
                    <div className="col-lg-4">                
                        <button className="btn btn-warning" onClick={decrement}>ลด</button>      
                    </div>                    
                    <div className="col-lg-4">                
                        <button className="btn btn-secondary" onClick={reset}>รีเซ็ท</button>      
                    </div>                    
                    <div className="col-lg-4">                
                        <button className="btn btn-success" onClick={increment}>เพิ่ม</button>      
                    </div>                    
                </div>
            </div>
        </BootstrapLayout>
    );
}

