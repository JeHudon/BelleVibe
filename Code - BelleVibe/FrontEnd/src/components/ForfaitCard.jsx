export function ForfaitCard({ forfait, isSelected, onClick }) {
    const config = {
        Cellulaire: { color: "info is-light", icon: "fa-signal", label: "Mobile" },
        "Wi-fi": { color: "primary is-light", icon: "fa-wifi", label: "Internet" },
        TV: { color: "link is-light", icon: "fa-tv", label: "TV" },
    };

    const { color, icon, label } = config[forfait.typeService] || {};
    if (!color) return null;

    return (
        <div
            onClick={onClick}
            style={{
                cursor: "pointer",
                transition: "transform 0.2s ease, opacity 0.2s ease",
                transform: isSelected ? "scale(0.99)" : "scale(1)", 
                opacity: isSelected ? 1 : 1,
            }}
        >
            <div className={`notification is-${color} ${isSelected ? "" : "is-light"} mb-2`}>
                <div className="is-flex is-align-items-center is-justify-content-space-between">
                    <div className="is-flex is-align-items-center" style={{ gap: "14px" }}>
                        <span className="icon is-medium">
                            <i className={`fa-solid ${icon}`} />
                        </span>
                        <div>
                            <p className="has-text-weight-semibold m-0">
                                {label} - {forfait.nomForfait}
                            </p>
                            <p className="is-size-7 m-0">
                                {forfait.descriptionForfait}
                            </p>
                        </div>
                    </div>
                    <div className="has-text-weight-bold">{forfait.prixForfait}$/mois</div>
                </div>
            </div>
        </div>
    );
}