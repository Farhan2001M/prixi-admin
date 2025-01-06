
import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { CustomToast } from "../../components/CustomToastService"; 

// Define the prop types
type DeleteConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  model: string;
  brand: string;
  onDelete: () => void; // Function called when deletion is confirmed
};

export const DeleteModelModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onClose, model, brand, onDelete }) => {
  const [confirmation, setConfirmation] = useState("");
  const [isDeleteEnabled, setIsDeleteEnabled] = useState(false);

  // Enable/disable the delete button based on the input
  useEffect(() => {
    setIsDeleteEnabled(confirmation === "DELETE");
  }, [confirmation]);

  useEffect(() => {
    setConfirmation("");
  }, [isOpen]);

  const handleDeleteClick = async () => {
    if (!isDeleteEnabled) {
      console.log("not typed delete correctly");
      return; // Prevent deletion if the delete button should be disabled
    }
    onClose(); // Close the modal

    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ;

    try {
      // Make DELETE API call using fetch
      const response = await fetch(`${BASE_URL}/delete-brand-model`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          brandName: brand,
          modelName: model,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        CustomToast.success(result.message); // Use custom toast for success
        onDelete(); // Call onDelete to refresh the list if needed
      } else {
        CustomToast.error(result.detail || "An error occurred while deleting the model"); // Use custom toast for error
      }
    } catch {
      CustomToast.error("An error occurred while deleting the model"); // Use custom toast for error
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onClose}>
        <ModalContent>
          {(onCloseModal) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Delete Model</ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to delete <strong>{model}</strong> car from the brand <strong>{brand}</strong>?
                </p>
                <p>Type <strong>DELETE</strong> below to confirm:</p>
                <Input 
                  fullWidth 
                  placeholder="Type DELETE to confirm" 
                  value={confirmation} 
                  onChange={(e) => setConfirmation(e.target.value)} 
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onCloseModal}>
                  Cancel
                </Button>
                <Button color="primary" isDisabled={!isDeleteEnabled} onPress={handleDeleteClick}>
                  Delete Model
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};


