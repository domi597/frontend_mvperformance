import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {getServices, IService} from "../api/services";
import "../css/ServicePage.css";

export default function ServicesPage() {
    const [services, setServices] = useState<IService[]>([]);
    const navigate = useNavigate();

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
            <section className="services">

                <div className="breadcrumb">
                    <span onClick={() => navigate("/")}>Startseite</span>
                    <span> › </span>
                    <span className="breadcrumb-active">Leistungen</span>
                </div>

                <p className="subtitle">WAS WIR ANBIETEN</p>
                <h2>Unsere Leistungen</h2>
                <p className="description">
                    Professionelle KFZ-Arbeiten — schnell, transparent und zu fairen Preisen.
                </p>

                <div className="services-grid">
                    {services.map((value) => (
                        <div className="service-card" key={value.id}>
                            <div className="icon-wrap">
                                <img src={`data:image/png;base64,${value.icon}`} alt="icon"/>
                            </div>
                            <h3>{value.title}</h3>
                            <p>{value.subtitle}</p>
                            <hr className="divider"/>
                            <div className="meta">
                                <span className="offer-price">{value.price} €</span>
                                <span className="offer-duration">⏱ {value.duration} min</span>
                            </div>
                            <Link to={"/termin"} className="cta-btn">Termin anfragen</Link>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}