import {Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getServices, IService } from "../api/services";
import "../css/ServicePage.css";

export default function ServicesPage() {
    const [services, setServices] = useState<IService[]>([]);



    useEffect(() => {
        const fetchServices = async () => {
            try {
                const data = await getServices();
                setServices(data);
            } catch (err) {
                console.log("ServicePage.tsx : " + err);
                setServices([]);
            }
        };
        
        fetchServices();
    }, []);

    return (
        <div className="services-page">

            {/* SERVICES */}
            <section className="services">
                <p className="subtitle">WAS WIR ANBIETEN</p>
                <h2>Unsere Leistungen</h2>
                <p className="description">
                    Professionelle KFZ-Arbeiten — schnell, transparent und zu fairen Preisen.
                </p>

                <div className="services-grid">
                    {services.map((value) => (
                        <div className="service-card" key={value.id}>
                            <div className="icon"><img src={`data:image/png;base64,${value.icon}`}/></div>
                            <h3>{value.title}</h3>
                            <p>{value.subtitle}</p>
                            <Link to={"/termin"} className="link">Termin anfragen →</Link>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
}