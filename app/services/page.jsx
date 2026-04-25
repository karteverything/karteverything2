import { FaCode, FaDesktop, FaTools } from "react-icons/fa";

const services = [
    {
        icon: <FaCode />,
        title: "Web Developement",
        description: "Custom websites built with care - clean, responsive, and user-friendly.",
    },
    {
        icon: <FaDesktop />,
        title: "Troubleshooting",
        description: "Diagnosing and fixing hardware or software issues so your system runs smoothly.",
    },
    {
        icon: <FaTools />,
        title: "Other Services",
        description: "Custom tech consultions and small digital support solutions.",
    },
];

export default function Services() {
    return (
        <section id="services" className="services-section">
            <h2>My Services</h2>
            <p>
                I provide reliable and creative solutions to help you build,
                maintain, and enhance your online and tech presence.
            </p>

            <div className="services-container">
                {services.map((service, index) => (
                <div className="box" key={index}>

                    <div className="icon">
                        {service.icon}
                    </div>

                    <div className="details">
                        <h3>{service.title}</h3>
                        <p>{service.description}</p>
                    </div>

                </div>
                ))}
            </div>
        </section>
    );
}