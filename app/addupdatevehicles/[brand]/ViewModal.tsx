import React, { useEffect, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Chip, Image } from "@nextui-org/react";

type ViewModelModalProps = {
  isOpen: boolean;
  onClose: () => void;
  modelName: string;
  brandName: string;
};

type ModelData = {
  modelName: string;
  vehicleType: string;
  engineType: string;
  description: string;
  torque: number;
  year: number;
  launchPrice: number;
  horsepower: number;
  seatingCapacity: number;
  variants: string[];
  colors: string[];
  images: string[]; // Base64 encoded images
};

export const ViewModelModal: React.FC<ViewModelModalProps> = ({ isOpen, onClose, modelName, brandName }) => {
  const [modelData, setModelData] = useState<ModelData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch model data when the modal is opened
  useEffect(() => {
    const fetchModelData = async () => {
      setLoading(true);
      const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

      try {
        const response = await fetch(`${BASE_URL}/vehicles/${brandName}/${modelName}`);
        if (response.ok) {
          const data = await response.json();
          setModelData(data);

          // Step 2: Trigger the vectorization process
          const vectorizeResponse = await fetch(`${BASE_URL}/vehicles/vectorize`, {
            method: "GET", // Changed to POST to match the server-side route
          });

          if (vectorizeResponse.ok) {
            console.log("Vehicles vectorized successfully!");
          } else {
            const vectorizeError = await vectorizeResponse.json();
            console.log(vectorizeError.detail || "Error vectorizing vehicles.");
          }

        } else {
          console.error("Failed to fetch model data");
        }
      } catch (error) {
        console.error("Error fetching model data:", error);
      }
      setLoading(false);
    };

    if (isOpen) {
      fetchModelData();
    } else {
      setModelData(null); // Reset model data when modal is closed
    }
  }, [isOpen, brandName, modelName]);

  if (loading) {
    return (
      <Modal size="5xl" isOpen={isOpen} onOpenChange={onClose}>
        <ModalContent>
          <ModalHeader>Loading...</ModalHeader>
        </ModalContent>
      </Modal>
    );
  }

  if (!modelData) {
    return (
      <Modal size="5xl" isOpen={isOpen} onOpenChange={onClose}>
        <ModalContent>
          <ModalHeader>No model data found.</ModalHeader>
        </ModalContent>
      </Modal>
    );
  }
  
  return (
    <Modal size="5xl" isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>
          {modelData.modelName} - {brandName}
        </ModalHeader>
        <ModalBody>
          <div className="flex gap-8 w-full">
            <p className="min-w-[200px]">
              <strong>Vehicle Type:</strong> {modelData.vehicleType}
            </p>
            <p className="min-w-[200px]">
              <strong>Engine Type:</strong> {modelData.engineType}
            </p>
            <p className="min-w-[200px]">
              <strong>Seating Capacity:</strong> {modelData.seatingCapacity}
            </p>
          </div>

          <div className="flex gap-8 w-full">
            <p className="min-w-[200px]">
              <strong>Torque:</strong> {modelData.torque} Nm
            </p>
            <p className="min-w-[200px]">
              <strong>Horsepower:</strong> {modelData.horsepower} HP
            </p>
            <div className="flex gap-5 justify-center items-center min-w-[200px]">
              <p><strong>Variants:</strong></p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {modelData.variants.map((variant, index) => (
                  <Chip key={index} color="secondary" variant="solid">{variant}</Chip>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-8 w-full">
            <p className="min-w-[200px]">
              <strong>Model Year:</strong> {modelData.year}
            </p>
            <p className="min-w-[200px]">
              <strong>Launch Price:</strong> ${modelData.launchPrice}
            </p>
            <div className="flex gap-5 justify-center items-center  min-w-[200px]">
              <p><strong>Colors:</strong></p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {modelData.colors.map((color, index) => (
                  <Chip key={index} color="success" variant="solid">{color}</Chip>
                ))}
              </div>
            </div>
          </div>

          <p><strong>Description:</strong> {modelData.description}</p>

          <p><strong>Images:</strong></p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {modelData.images.map((image, index) => (
              <Image
                key={index}
                src={image} // Use the URL directly
                alt={`Image ${index + 1}`}
                width={100}
                height={100}
                isZoomed
              />
            ))}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};


