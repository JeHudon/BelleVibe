import { useState, useEffect } from "react";

function Notification({ message, type, onClose }) {
	useEffect(() => {
		if (!message) return;
		const timer = setTimeout(onClose, 3000);
		return () => clearTimeout(timer);
	}, [message]);

	if (!message) return null;

	// return (
	// 	<div
	// 		className={`notification ${type === "success" ? "is-success" : "is-danger"}`}
	// 		style={{
	// 			position: "fixed",
	// 			bottom: "1.5rem",
	// 			right: "1.5rem",
	// 			zIndex: 9999,
	// 			minWidth: "280px",
	// 			boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
	// 		}}
	// 	>
	// 		<button className="delete" onClick={onClose}></button>
	// 		{message}
	// 	</div>
	// );
	return (
		<div className={`notification ${type === "success" ? "is-success" : "is-danger"} mb-4`}>
			<button className="delete" onClick={onClose}></button>
			{message}
		</div>
	);
}

export function ConfirmModal({ isOpen, title, description, itemName, onConfirm, onClose }) {
	const [notif, setNotif] = useState({ message: "", type: "" });

	if (!isOpen) return null;

	async function handleConfirm() {
		try {
			await onConfirm({
				onSuccess: (msg) =>
					setNotif({ message: msg || "Supprimé avec succès", type: "success" }),
				onError: (msg) =>
					setNotif({ message: msg || "Une erreur est survenue", type: "error" }),
			});
		} catch {
			setNotif({ message: "Une erreur est survenue", type: "error" });
		}
	}

	return (
		<div className="modal is-active">
			<div className="modal-background" onClick={onClose}></div>
			<div className="modal-card">
				<header className="modal-card-head">
					<p className="modal-card-title">{title}</p>
					<button className="delete" onClick={onClose}></button>
				</header>
				<section className="modal-card-body">
					<Notification
						message={notif.message}
						type={notif.type}
						onClose={() => setNotif({ message: "", type: "" })}
					/>
					<p>{description}</p>
					{itemName && <p className="has-text-weight-bold mt-2">{itemName}</p>}
				</section>
				<footer className="modal-card-foot">
					<button className="button is-danger mr-2" onClick={handleConfirm}>
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

export function FormModal({
	isOpen,
	title,
	onConfirm,
	onClose,
	confirmLabel = "Enregistrer",
	fields = [],
	values = {},
	onChange,
}) {
	const [notif, setNotif] = useState({ message: "", type: "" });

	if (!isOpen) return null;

	async function handleConfirm() {
		try {
			await onConfirm({
				onSuccess: (msg) =>
					setNotif({ message: msg || "Enregistré avec succès", type: "success" }),
				onError: (msg) =>
					setNotif({ message: msg || "Une erreur est survenue", type: "error" }),
			});
		} catch {
			setNotif({ message: "Une erreur est survenue", type: "error" });
		}
	}

	return (
		<div className="modal is-active">
			<div className="modal-background" onClick={onClose}></div>
			<div className="modal-card">
				<header className="modal-card-head">
					<p className="modal-card-title">{title}</p>
					<button className="delete" onClick={onClose}></button>
				</header>
				<section className="modal-card-body">
					<Notification
						message={notif.message}
						type={notif.type}
						onClose={() => setNotif({ message: "", type: "" })}
					/>
					{fields.map(({ key, label, type = "text", options }) => (
						<div className={"field" + (type === "checkbox" ? " mt-5" : "")} key={key}>
							{type !== "checkbox" && <label className="label">{label}</label>}
							{type === "textarea" ? (
								<textarea
									className="textarea"
									value={values[key] ?? ""}
									onChange={(e) => onChange(key, e.target.value)}
								/>
							) : type === "select" ? (
								<div className="select is-fullwidth">
									<select
										value={values[key] ?? ""}
										onChange={(e) => onChange(key, e.target.value)}
									>
										{options.map((opt) => (
											<option key={opt}>{opt}</option>
										))}
									</select>
								</div>
							) : type === "checkbox" ? (
								<label
									className="checkbox"
									style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
								>
									<input
										type="checkbox"
										checked={!!values[key]}
										onChange={(e) => onChange(key, e.target.checked)}
										style={{ width: "1rem", height: "1rem", cursor: "pointer" }}
									/>
									{label}
								</label>
							) : (
								<input
									className="input"
									type={type}
									value={values[key] ?? ""}
									onChange={(e) => onChange(key, e.target.value)}
								/>
							)}
						</div>
					))}
				</section>
				<footer className="modal-card-foot">
					<button className="button is-dark mr-2" onClick={handleConfirm}>
						{confirmLabel}
					</button>
					<button className="button" onClick={onClose}>
						Annuler
					</button>
				</footer>
			</div>
		</div>
	);
}
