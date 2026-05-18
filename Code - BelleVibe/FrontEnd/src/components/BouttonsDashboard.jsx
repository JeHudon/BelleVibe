import { Link } from "react-router-dom";

export default function BouttonDashboard({ link, couleur, texte }) {
    return (
        <div className="column is-one-third-desktop is-half-mobile">
            <Link to={link} className={`${couleur} button is-fullwidth is-flex is-flex-direction-column`}>
                <span className="is-size-9 has-text-weight-semibold">{texte}</span>
            </Link>
        </div>
    )
}