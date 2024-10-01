import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { MdErrorOutline } from "react-icons/md";

// Define the prop types
type DeleteConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  model: any;
  brand: any;
  onDelete: () => void; // Function called when deletion is confirmed
};

export const DeleteModelModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onClose, model, brand, onDelete }) => {
  const [confirmation, setConfirmation] = useState("");
  const [isDeleteEnabled, setIsDeleteEnabled] = useState(false);

  // Enable/disable the delete button based on the input
  useEffect(() => {
    setIsDeleteEnabled(confirmation === "DELETE");
  }, [confirmation]);

  useEffect(()=>{
    setConfirmation("");
  },[isOpen])

  const handleDeleteClick = async () => {
    if (!isDeleteEnabled) {
      console.log("not typed delete correctly");
      return; // Prevent deletion if the delete button should be disabled
    }
    onClose(); // Close the modal
    try {
      // Make DELETE API call using fetch
      const response = await fetch('http://localhost:8000/delete-brand-model', {
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
        toast.success(result.message, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            style: { backgroundColor: 'black', color: 'white' }, // Black background
        });
        onDelete(); // Call onDelete to refresh the list if needed
      } else {
        toast.error(result.detail || "An error occurred while deleting the model", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          style: { 
            backgroundColor: '#ff4040', // Change to white to better show the border
            color: 'White', 
            // border: '2px solid black', // Red border
            fontWeight: 'bold', 
            fontSize: '1rem' // Adjust font size as needed
          },
          icon: <span style={{ color: 'white' , fontSize: '1.5rem'  }}><MdErrorOutline /></span>, // Custom icon with white color
        });
      }
    } catch{
      toast.error("An error occurred while deleting the model", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        style: { 
            backgroundColor: 'white', // Change to white to better show the border
            color: 'red', 
            border: '2px solid red', // Red border
            fontWeight: 'medium', 
            fontSize: '1rem' // Adjust font size as needed
          },
      });
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
                  isClearable
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
      {/* Toast container for notifications */}
      <ToastContainer />
    </>
  );
};


