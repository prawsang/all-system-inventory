import React from "react";

const Modal = ({ close, active, title, children, style }) => (
	<div className={`modal-background ${active ? "" : "is-hidden"}`} onClick={close} style={style}>
		<div className="panel content" onClick={e => e.stopPropagation()}>
			<div className="panel-content">
				{title && (
					<div>
						<h5 className="no-mt has-mb-10">{title}</h5>
						<hr />
					</div>
				)}
				{children}
			</div>
		</div>
	</div>
);

export default Modal;
