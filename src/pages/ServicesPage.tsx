import {Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getServices, IService } from "../api/services";
import "../css/ServicePage.css";
import carImg from "../pics/redBmw.png";

export default function ServicesPage() {
    const navigate = useNavigate();
    const [services, setServices] = useState<IService[]>([]);

    const getServices = async () => {
        try {
            const data = await getServices();
            setServices(data);
        } catch (err) {
            console.log("ServicePage.tsx : " + err);
            setServices([]);
        }
    };

    useEffect(() => {
        getServices();
    }, []);

    return (
        <div className="services-page">

            {/* HERO */}
            <section className="hero">
                <div className="hero-text">
                    <h1>
                        KFZ-Technik GDG – <br />
                        Ihre Werkstatt <br />
                        <span>in Leibnitz</span>
                    </h1>

                    <p>Die Autowerkstatt, die Leibnitz vertraut.</p>

                    <div className="hero-buttons">
                        <button onClick={() => navigate("/termin")} className="primary-btn">
                            Termin anfragen
                        </button>
                        <button className="secondary-btn">
                            Bewertungen ansehen
                        </button>
                    </div>
                </div>
            </section>

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
                            <div className="icon">{value.icon}</div>
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