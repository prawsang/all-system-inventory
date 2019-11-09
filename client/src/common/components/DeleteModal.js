import React from "react";
import Modal from "./Modal";

const DeleteModal = ({ active, close, onDelete }) => (
    <Modal
        active={active}
        close={close}
        title="Confirm Deletion"
    >
        <p>Are you sure you want to delete?</p>
        <div className="buttons">
            <button className="button is-danger" onClick={onDelete}>
                Delete
            </button>
            <button
                className="button is-light"
                onClick={close}
            >
                Cancel
            </button>
        </div>
    </Modal>
)
export default DeleteModal;