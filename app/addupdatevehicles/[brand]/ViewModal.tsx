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
      try {
        const response = await fetch(`https://de05-2407-d000-1a-66a0-6050-2c36-62e5-9435.ngrok-free.app/vehicles/${brandName}/${modelName}`);
        if (response.ok) {
          const data = await response.json();
          setModelData(data);
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
          <p><strong>Vehicle Type:</strong> {modelData.vehicleType}</p>
          <p><strong>Engine Type:</strong> {modelData.engineType}</p>
          <p><strong>Description:</strong> {modelData.description}</p>
          <p><strong>Torque:</strong> {modelData.torque} Nm</p>
          <p><strong>Launch Price:</strong> ${modelData.launchPrice}</p>
          <p><strong>Horsepower:</strong> {modelData.horsepower} HP</p>
          <p><strong>Seating Capacity:</strong> {modelData.seatingCapacity}</p>

          <p><strong>Variants:</strong></p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {modelData.variants.map((variant, index) => (
              <Chip key={index} color="secondary" variant="solid">{variant}</Chip>
            ))}
          </div>

          <p><strong>Colors:</strong></p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {modelData.colors.map((color, index) => (
              <Chip key={index} color="success" variant="solid">{color}</Chip>
            ))}
          </div>

          <p><strong>Images:</strong></p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {modelData.images.map((image, index) => (
              <Image
                key={index}
                src={`data:image/jpeg;base64,${image}`}
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














// import React, { useEffect, useState } from "react";
// import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Chip, Image } from "@nextui-org/react";

// type ViewModelModalProps = {
//   isOpen: boolean;
//   onClose: () => void;
//   modelName: string;
//   brandName: string;
// };

// type ModelData = {
//   modelName: string;
//   vehicleType: string;
//   engineType: string;
//   description: string;
//   torque: number;
//   launchPrice: number;
//   horsepower: number;
//   seatingCapacity: number;
//   variants: string[];
//   colors: string[];
//   images: string[]; // Base64 encoded images
// };

// export const ViewModelModal: React.FC<ViewModelModalProps> = ({ isOpen, onClose, modelName, brandName }) => {
//   const [modelData, setModelData] = useState<ModelData | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   // Fetch model data when the modal is opened
//   useEffect(() => {
//     if (isOpen) {
//       const fetchModelData = async () => {
//         setLoading(true);
//         try {
//           const response = await fetch(`http://localhost:8000/vehicles/${brandName}/${modelName}`);
//           if (response.ok) {
//             const data = await response.json();
//             setModelData(data);
//           } else {
//             console.error("Failed to fetch model data");
//           }
//         } catch (error) {
//           console.error("Error fetching model data:", error);
//         }
//         setLoading(false);
//       };

//       fetchModelData();
//     }
//   }, [isOpen, brandName, modelName]);

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   if (!modelData) {
//     return <p>No model data found.</p>;
//   }

//   return (
//     <Modal size="5xl" isOpen={isOpen} onOpenChange={onClose}>
//       <ModalContent>
//         {(onCloseModal) => (
//           <>
//             <ModalHeader>
//               {modelData.modelName} - {brandName}
//             </ModalHeader>
//             <ModalBody>
//               <p><strong>Vehicle Type:</strong> {modelData.vehicleType}</p>
//               <p><strong>Engine Type:</strong> {modelData.engineType}</p>
//               <p><strong>Description:</strong> {modelData.description}</p>
//               <p><strong>Torque:</strong> {modelData.torque} Nm</p>
//               <p><strong>Launch Price:</strong> ${modelData.launchPrice}</p>
//               <p><strong>Horsepower:</strong> {modelData.horsepower} HP</p>
//               <p><strong>Seating Capacity:</strong> {modelData.seatingCapacity}</p>

//               <p><strong>Variants:</strong></p>
//               <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
//                 {modelData.variants.map((variant, index) => (
//                   <Chip key={index} color="primary" variant="flat">{variant}</Chip>
//                 ))}
//               </div>

//               <p><strong>Colors:</strong></p>
//               <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
//                 {modelData.colors.map((color, index) => (
//                   <Chip key={index} color="primary" variant="flat">{color}</Chip>
//                 ))}
//               </div>

//               <p><strong>Images:</strong></p>
//               <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
//                 {modelData.images.map((image, index) => (
//                   <Image
//                     key={index}
//                     src={`data:image/jpeg;base64,${image}`} // Convert base64 back to image
//                     alt={`Image ${index + 1}`}
//                     width={100} // Small image size
//                     height={100}
//                     isZoomed // Zoom on hover
//                   />
//                 ))}
//               </div>
//             </ModalBody>
//             <ModalFooter>
//               <Button color="secondary" onPress={onCloseModal}>
//                 Close
//               </Button>
//             </ModalFooter>
//           </>
//         )}
//       </ModalContent>
//     </Modal>
//   );
// };

