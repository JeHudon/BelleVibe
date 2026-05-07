// components/FileViewer.jsx
const API = "http://localhost:3000";

export default function FileViewer({ id, ext, fileName, isOpen, onClose }) {
	const fileUrl = `${API}/files/${id}`;
	const extension = ext?.toLowerCase();

	const renderPreview = () => {
		if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {
			return <img src={fileUrl} alt="aperçu" style={{ maxWidth: "100%" }} />;
		}
		if (extension === "pdf") {
			return <iframe src={fileUrl} width="100%" height="600px" width="1000px" style={{ border: "none" }} />;
		}
		if (["doc", "docx", "xls", "xlsx"].includes(extension)) {
			return (
				<iframe
					src={`https://docs.google.com/gviewer?url=${encodeURIComponent(fileUrl)}&embedded=true`}
					width="100%"
					height="600px"
					style={{ border: "none" }}
				/>
			);
		}
		return <p>Aperçu non disponible pour ce type de fichier.</p>;
	};

	if (!isOpen) return null;

	return (
		<div className="modal is-active">
			<div className="modal-background" onClick={onClose} />
			<div className="modal-card" style={{ width: "auto" }}>
				<header className="modal-card-head">
					<p className="modal-card-title">{fileName}</p>
					<button className="delete" onClick={onClose} />
				</header>
				<section className="modal-card-body">{renderPreview()}</section>
				<footer className="modal-card-foot">
					<button className="button" onClick={onClose}>
						Fermer
					</button>
				</footer>
			</div>
		</div>
	);
}
