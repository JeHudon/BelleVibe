import { useState, useRef, useCallback } from "react";

export default function AjouterDocuments({ isOpen, onClose, idDossier }) {
	const [files, setFiles] = useState([]);
	const [isDragging, setIsDragging] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const inputRef = useRef(null);

	const addFiles = (newFiles) => {
		setFiles((prev) => {
			const merged = [...prev];

			for (const f of newFiles) {
				if (
					!merged.find(
						(x) => x.file.name === f.name && x.file.size === f.size,
					)
				) {
					merged.push({
						file: f,
						name: f.name, // default name
					});
				}
			}

			return merged;
		});
	};

	const removeFile = (index) =>
		setFiles((prev) => prev.filter((_, i) => i !== index));

	const handleDrop = useCallback((e) => {
		e.preventDefault();
		setIsDragging(false);
		addFiles(Array.from(e.dataTransfer.files));
	}, []);

	const handleDragOver = (e) => {
		e.preventDefault();
		setIsDragging(true);
	};
	const handleDragLeave = () => setIsDragging(false);

	const handleUpload = async () => {
		setIsUploading(true);

		try {
			await Promise.all(
				files.map((f) => {
					const formData = new FormData();
					formData.append("fichier", f.file);
					formData.append("nomDocument", f.name);

					return fetch(`/api/documents/${idDossier}/file`, {
						method: "POST",
						body: formData,
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					});
				}),
			);

			setFiles([]);
			onClose();
		} catch (err) {
			console.error("Upload error:", err);
		} finally {
			setIsUploading(false);
		}
	};
	// const handleUpload = () => {
	// 	setIsUploading(true);
	// 	setTimeout(() => {
	// 		setIsUploading(false);
	// 		setFiles([]);
	// 		onClose();
	// 	}, 1500);
	// };

	const handleClose = () => {
		setFiles([]);
		setIsDragging(false);
		onClose();
	};

	const formatSize = (bytes) => {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	};

	return (
		<div className={`modal ${isOpen ? "is-active" : ""}`}>
			<div className="modal-background" onClick={handleClose} />
			<div
				className="modal-card"
				style={{ maxWidth: 720, width: "100%" }}
			>
				<header className="modal-card-head">
					<p className="modal-card-title">Ajouter un document</p>
					<button
						className="delete"
						onClick={handleClose}
						aria-label="close"
					/>
				</header>

				<section className="modal-card-body">
					<div
						onClick={() => inputRef.current.click()}
						onDrop={handleDrop}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						style={{
							border: `2px dashed ${isDragging ? "#3273dc" : "#dbdbdb"}`,
							borderRadius: 8,
							padding: "2rem 1.5rem",
							textAlign: "center",
							cursor: "pointer",
							background: isDragging ? "#f0f5ff" : "transparent",
							transition: "border-color 0.2s, background 0.2s",
						}}
					>
						<p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
							⬆
						</p>
						<p className="has-text-weight-semibold">
							Glisser-déposer des fichiers ici
						</p>
						<p className="has-text-grey is-size-7 mt-1 mb-3">
							ou cliquer pour parcourir
						</p>
						<span className="tag is-light is-size-7">
							Images, PDF, DOC, TXT — max 10 Mo
						</span>
						<input
							ref={inputRef}
							type="file"
							multiple
							style={{ display: "none" }}
							onChange={(e) =>
								addFiles(Array.from(e.target.files))
							}
						/>
					</div>

					{files.length > 0 && (
						<div className="mt-4">
							{files.map((f, i) => (
								<div
									key={i}
									className="is-flex is-align-items-center mb-2"
									style={{
										gap: 10,
										padding: "0.5rem 0.75rem",
										border: "1px solid #dbdbdb",
										borderRadius: 6,
										fontSize: "0.875rem",
									}}
								>
									<span className="icon is-small has-text-grey">
										📄
									</span>

									<input
										className="input is-small"
										style={{ flex: 1 }}
										value={f.name}
										onChange={(e) => {
											const newName = e.target.value;
											setFiles((prev) =>
												prev.map((fileObj, index) =>
													index === i
														? {
																...fileObj,
																name: newName,
															}
														: fileObj,
												),
											);
										}}
									/>

									<span className="has-text-grey is-size-7">
										{formatSize(f.file.size)}
									</span>

									<button
										className="delete is-small"
										onClick={(e) => {
											e.stopPropagation();
											removeFile(i);
										}}
									/>
								</div>
							))}
						</div>
					)}
				</section>

				<footer
					className="modal-card-foot"
					style={{ justifyContent: "flex-end", gap: "0.5rem" }}
				>
					<button className="button" onClick={handleClose}>
						Annuler
					</button>
					<button
						className={`button is-dark ${isUploading ? "is-loading" : ""}`}
						disabled={files.length === 0 || isUploading}
						onClick={handleUpload}
					>
						Envoyer {files.length > 0 && `(${files.length})`}
					</button>
				</footer>
			</div>
		</div>
	);
}
