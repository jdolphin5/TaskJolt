import React, { useState } from "react";
import { Modal, Button } from "antd";

interface AddProjectProps {
  showHideAddProjectModal: boolean;
  setShowHideAddProjectModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddProjectModal: React.FC<AddProjectProps> = ({
  showHideAddProjectModal,
  setShowHideAddProjectModal,
}) => {
  const handleOk = () => {
    setShowHideAddProjectModal(false);
  };

  const handleCancel = () => {
    setShowHideAddProjectModal(false);
  };

  return (
    <div>
      <Modal
        title="Basic Modal"
        visible={showHideAddProjectModal}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Some contents...</p>
      </Modal>
    </div>
  );
};

export default AddProjectModal;
