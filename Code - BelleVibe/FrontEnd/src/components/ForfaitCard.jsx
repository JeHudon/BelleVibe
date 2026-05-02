export function ForfaitCard({ forfait, isDark }) {
    const config = {
        Cellulaire: { color: "info", icon: "fa-signal", label: "Mobile" },
        "Wi-fi": { color: "primary", icon: "fa-wifi", label: "Internet" },
        TV: { color: "link is-light", icon: "fa-tv", label: "TV" },
    };

    const { color, icon, label } = config[forfait.typeService] || {};
    if (!color) return null;

    return (
        <div className={`notification is-${color} ${isDark ? "" : "is-light"} mb-2`}>
            <div className="is-flex is-align-items-center" style={{ gap: "14px" }}>
                <span className="icon is-medium">
                    <i className={`fa-solid ${icon}`} />
                </span>
                <div>
                    <p className="has-text-weight-semibold m-0">
                        {label} - {forfait.nomForfait}
                    </p>
                    <p className="has-text-grey is-size-7 m-0" >
                        {forfait.descriptionForfait}
                    </p>
                </div>
            </div>
        </div>
    );
}