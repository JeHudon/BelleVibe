
export default function CardsDashboard({ label, value, color }) {
    return (
        <div className="column">
            <div className={`notification ${color} is-light`}>
                <div className="level is-mobile">
                    <div className="level-left">
                        <div>
                            <p className="heading">{label}</p>
                            <p className="title">{value}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

