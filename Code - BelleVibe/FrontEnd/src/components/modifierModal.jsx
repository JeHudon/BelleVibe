export function FormModal({ isOpen, title, onConfirm, onClose, confirmLabel = "Enregistrer", fields = [], values = {}, onChange }) {
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
					{fields.map(({ key, label, type = "text", options }) => (
						<div className="field" key={key}>
							<label className="label">{label}</label>
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
					<button className="button is-dark" onClick={onConfirm}>
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