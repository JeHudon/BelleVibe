export function ConfirmModal({ isOpen, title, description, itemName, onConfirm, onClose }) {
	if (!isOpen) return null;
 
	return (
		<div className="modal is-active">
			<div className="modal-background" onClick={onClose}></div>
			<div className="modal-card">
				<header className="modal-card-head">
					<p className="modal-card-title">{title}</p>
					<button className="delete" onClick={onClose}></button>
				</header>
				<section className="modal-card-body">
					<p>{description}</p>
					{itemName && <p className="has-text-weight-bold mt-2">{itemName}</p>}
				</section>
				<footer className="modal-card-foot">
					<button className="button is-danger" onClick={onConfirm}>
						Supprimer
					</button>
					<button className="button" onClick={onClose}>
						Annuler
					</button>
				</footer>
			</div>
		</div>
	);
}