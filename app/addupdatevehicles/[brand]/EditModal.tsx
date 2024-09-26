import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, Select, SelectItem, Chip, } from "@nextui-org/react";

type EditModelModalProps = {
  isOpen: boolean;
  onClose: () => void;
  brandName: string;
  modelName: string;
  onEdit: () => void;
};

export const EditModelModal: React.FC<EditModelModalProps> = ({ isOpen, onClose, brandName, modelName, onEdit }) => {

  const [newModelName, setNewModelName] = useState<string>(modelName || ""); // Editable model name
  const [vehicleType, setVehicleType] = useState<string | undefined>(undefined);
  const [engineType, setEngineType] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState<string>("");
  const [torque, setTorque] = useState<number | undefined>(undefined);
  const [launchPrice, setLaunchPrice] = useState<number | undefined>(undefined);
  const [horsepower, setHorsepower] = useState<number | undefined>(undefined);
  const [seatingCapacity, setSeatingCapacity] = useState<number | undefined>(undefined);
  const [variants, setVariants] = useState<string[]>([]);
  const [variantInput, setVariantInput] = useState<string>("");
  const [colors, setColors] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]); // Store current images
  const [error, setError] = useState<string | null>(null); // Error state

  // Fetch existing model data when modal is opened
  useEffect(() => {
    if (isOpen) {
      const fetchModelData = async () => {
        try {
          const response = await fetch(`http://localhost:8000/vehicles/${brandName}/${modelName}`);
          if (response.ok) {
            const data = await response.json();
            setNewModelName(data.modelName); // Set initial model name
            setVehicleType(data.vehicleType);
            setEngineType(data.engineType);
            setDescription(data.description);
            setTorque(data.torque);
            setLaunchPrice(data.launchPrice);
            setHorsepower(data.horsepower);
            setSeatingCapacity(data.seatingCapacity);
            setVariants(data.variants || []);
            setColors(data.colors || []);
            setExistingImages(data.images || []); // Store current images
          } else {
            console.error("Failed to fetch model data");
          }
        } catch (error) {
          console.error("Error fetching model data:", error);
        }
      };

      fetchModelData();
    }
  }, [isOpen, brandName, modelName]);


  useEffect(()=>{
    setVariantInput("");
  },[isOpen])

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const validFiles: File[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 2 * 1024 * 1024) {
          console.error(`File ${file.name} exceeds 2MB.`);
        } else if (!["image/jpeg", "image/png"].includes(file.type)) {
          console.error(`File ${file.name} must be a PNG or JPEG.`);
        } else {
          validFiles.push(file);
        }
      }
      setImages((prev) => [...prev, ...validFiles]); // Append new images
    }
  };

  const handleRemoveImage = (index: number, isExisting: boolean = false) => {
    if (isExisting) {
      setExistingImages((prev) => prev.filter((_, i) => i !== index)); // Remove existing image
    } else {
      setImages((prev) => prev.filter((_, i) => i !== index)); // Remove new image
    }
  };

  const handleAddVariant = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && variantInput.trim()) {
      if (/^[a-zA-Z0-9]+$/.test(variantInput)) {
        if (!variants.includes(variantInput.trim())) {
          setVariants((prevVariants) => [...prevVariants, variantInput.trim()]);
          setVariantInput(""); // Clear input after adding
        } else {
          console.error("Variant already exists.");
        }
      } else {
        console.error("Variant must be alphanumeric.");
      }
      e.preventDefault();
    }
  };

  const handleRemoveVariant = (variantToRemove: string) => {
    setVariants((prevVariants) =>
      prevVariants.filter((variant) => variant !== variantToRemove)
    );
  };

  const handleSubmit = async () => {
    setError(null); // Clear error before submission

    if (!newModelName || !vehicleType || !engineType || !description || !torque || !launchPrice || !horsepower || !seatingCapacity || colors.length === 0 || variants.length === 0 || (existingImages.length === 0 && images.length === 0)) {
      setError("Please fill out all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("new_modelName", newModelName);
    formData.append("vehicleType", vehicleType as string);
    formData.append("engineType", engineType as string);
    formData.append("description", description);
    formData.append("torque", torque?.toString() || "");
    formData.append("launchPrice", launchPrice?.toString() || "");
    formData.append("horsepower", horsepower?.toString() || "");
    formData.append("seatingCapacity", seatingCapacity?.toString() || "");

    // Append variants and colors
    variants.forEach((variant) => formData.append("variants", variant));
    colors.forEach((color) => formData.append("colors", color));

    // Append new images
    images.forEach((image) => formData.append("images", image));

    try {
      const response = await fetch(`http://localhost:8000/vehicles/${brandName}/update-model/${modelName}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        console.log("Model updated successfully!");
        onClose(); // Close the modal after successful update
        onEdit();
      } else {
        const errorData = await response.json();
        setError(errorData.detail);
      }
    } catch (error) {
      setError("An error occurred while updating the model.");
    }
  };

  return (
    <Modal size="5xl" isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        {(onCloseModal) => (
          <>
            <ModalHeader>Edit Model: {modelName} ({brandName})</ModalHeader>
            <ModalBody>
              <form className="flex flex-col gap-4">
                <Input
                  label="Model Name"
                  value={newModelName}
                  onChange={(e) => setNewModelName(e.target.value)} // Editable field
                  required
                />

                <div className="flex gap-5">
                  <Select
                    label="Vehicle Type"
                    selectedKeys={vehicleType ? new Set([vehicleType]) : new Set([])}
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0];
                      setVehicleType(selectedKey as string);
                    }}
                  >
                      <SelectItem key="SUV">SUV</SelectItem>
                      <SelectItem key="Sedan">Sedan</SelectItem>
                      <SelectItem key="Compact">Compact</SelectItem>
                      <SelectItem key="Coupe">Coupe</SelectItem>
                      <SelectItem key="Hatchback">Hatchback</SelectItem>
                      <SelectItem key="Pickup-Truck">Pickup-Truck</SelectItem>
                  </Select>

                  <Select
                    label="Engine Type"
                    selectedKeys={engineType ? new Set([engineType]) : new Set([])}
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0];
                      setEngineType(selectedKey as string);
                    }}
                  >
                      <SelectItem key="Petrol">Petrol</SelectItem>
                      <SelectItem key="Diesel">Diesel</SelectItem>
                      <SelectItem key="Electric">Electric</SelectItem>
                      <SelectItem key="Hybrid">Hybrid</SelectItem>
                  </Select>
                </div>

                <div className="flex gap-5">
                  <Input
                    label="Torque"
                    type="number"
                    value={torque?.toString() || ""}
                    onChange={(e) => setTorque(e.target.value ? parseFloat(e.target.value) : undefined)}
                  />

                  <Input
                    label="Launch Price"
                    type="number"
                    value={launchPrice?.toString() || ""}
                    onChange={(e) => setLaunchPrice(e.target.value ? parseFloat(e.target.value) : undefined)}
                  />

                  <Input
                    label="Horsepower"
                    type="number"
                    value={horsepower?.toString() || ""}
                    onChange={(e) => setHorsepower(e.target.value ? parseFloat(e.target.value) : undefined)}
                  />

                  <Input
                    label="Seating Capacity"
                    type="number"
                    value={seatingCapacity?.toString() || ""}
                    onChange={(e) => setSeatingCapacity(e.target.value ? parseFloat(e.target.value) : undefined)}
                  />
                </div>

                <Select
                  label="Colors"
                  multiple
                  selectedKeys={new Set(colors)}
                  onSelectionChange={(keys) => setColors(Array.from(keys) as string[])}
                >
                  <SelectItem key="Black">Black</SelectItem>
                  <SelectItem key="White">White</SelectItem>
                  <SelectItem key="Red">Red</SelectItem>
                  <SelectItem key="Blue">Blue</SelectItem>
                  <SelectItem key="Yellow">Yellow</SelectItem>
                  <SelectItem key="Pink">Pink</SelectItem>
                  <SelectItem key="Green">Green</SelectItem>
                  <SelectItem key="Aura">Aura</SelectItem>
                  <SelectItem key="Teal">Teal</SelectItem>
                  <SelectItem key="Gray">Gray</SelectItem>
                  <SelectItem key="Brown">Brown</SelectItem>
                  <SelectItem key="Ivory">Ivory</SelectItem>
                  <SelectItem key="Silver">Silver</SelectItem>
                </Select>

                <Input
                  type="file"
                  multiple
                  accept="image/png, image/jpeg"
                  onChange={handleImageChange}
                />

                <div className="flex gap-2">
                  {existingImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img src={`data:image/jpeg;base64,${image}`} alt="Existing" width="100px" />
                      <button
                        className="absolute top-0 right-0 bg-red-500 text-white"
                        onClick={() => handleRemoveImage(index, true)}
                      >
                        X
                      </button>
                    </div>
                  ))}
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img src={URL.createObjectURL(image)} alt="New" width="100px" />
                      <button
                        className="absolute top-0 right-0 bg-red-500 text-white"
                        onClick={() => handleRemoveImage(index, false)}
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>

                <Input
                  label="Variants"
                  value={variantInput}
                  onChange={(e) => setVariantInput(e.target.value)}
                  onKeyDown={handleAddVariant}
                  endContent={
                    <div className="flex gap-2">
                      {variants.map((variant) => (
                        <Chip
                          key={variant}
                          onClose={() => handleRemoveVariant(variant)}
                          color="primary"
                          variant="flat"
                        >
                          {variant}
                        </Chip>
                      ))}
                    </div>
                  }
                />

                <Textarea
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </form>
              {error && <div className="text-red-500">{error}</div>}
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onPress={handleSubmit}>
                Update Model
              </Button>
              <Button color="secondary" onPress={onCloseModal}>
                Cancel
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};









































































// import React, { useState, useEffect } from "react";
// import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, Select, SelectItem, Chip, } from "@nextui-org/react";

// type EditModelModalProps = {
//   isOpen: boolean;
//   onClose: () => void;
//   brandName: string;
//   modelName: string;
// };

// export const EditModelModal: React.FC<EditModelModalProps> = ({ isOpen, onClose, brandName, modelName, }) => {

//   const [newModelName, setNewModelName] = useState<string>(modelName); // Editable model name
//   const [vehicleType, setVehicleType] = useState<string | undefined>(undefined);
//   const [engineType, setEngineType] = useState<string | undefined>(undefined);
//   const [description, setDescription] = useState<string>("");
//   const [torque, setTorque] = useState<number | undefined>(undefined);
//   const [launchPrice, setLaunchPrice] = useState<number | undefined>(undefined);
//   const [horsepower, setHorsepower] = useState<number | undefined>(undefined);
//   const [seatingCapacity, setSeatingCapacity] = useState<number | undefined>(undefined);
//   const [variants, setVariants] = useState<string[]>([]);
//   const [variantInput, setVariantInput] = useState<string>("");
//   const [colors, setColors] = useState<string[]>([]);
//   const [images, setImages] = useState<File[]>([]);
//   const [existingImages, setExistingImages] = useState<string[]>([]); // Store current images
//   const [error, setError] = useState<string | null>(null); // Error state

//   // Fetch existing model data when modal is opened
//   useEffect(() => {
//     if (isOpen) {
//       const fetchModelData = async () => {
//         try {
//           const response = await fetch(`http://localhost:8000/vehicles/${brandName}/${modelName}`);
//           if (response.ok) {
//             const data = await response.json();
//             setNewModelName(data.modelName); // Set initial model name
//             setVehicleType(data.vehicleType);
//             setEngineType(data.engineType);
//             setDescription(data.description);
//             setTorque(data.torque);
//             setLaunchPrice(data.launchPrice);
//             setHorsepower(data.horsepower);
//             setSeatingCapacity(data.seatingCapacity);
//             setVariants(data.variants || []);
//             setColors(data.colors || []);
//             setExistingImages(data.images || []); // Store current images
//           } else {
//             console.error("Failed to fetch model data");
//           }
//         } catch (error) {
//           console.error("Error fetching model data:", error);
//         }
//       };

//       fetchModelData();
//     }
//   }, [isOpen, brandName, modelName]);

//   const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const files = event.target.files;
//     if (files) {
//       const validFiles: File[] = [];
//       for (let i = 0; i < files.length; i++) {
//         const file = files[i];
//         if (file.size > 2 * 1024 * 1024) {
//           console.error(`File ${file.name} exceeds 2MB.`);
//         } else if (!["image/jpeg", "image/png"].includes(file.type)) {
//           console.error(`File ${file.name} must be a PNG or JPEG.`);
//         } else {
//           validFiles.push(file);
//         }
//       }
//       setImages((prev) => [...prev, ...validFiles]); // Append new images
//     }
//   };

//   const handleRemoveImage = (index: number, isExisting: boolean = false) => {
//     if (isExisting) {
//       setExistingImages((prev) => prev.filter((_, i) => i !== index)); // Remove existing image
//     } else {
//       setImages((prev) => prev.filter((_, i) => i !== index)); // Remove new image
//     }
//   };

//   const handleAddVariant = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && variantInput.trim()) {
//       if (/^[a-zA-Z0-9]+$/.test(variantInput)) {
//         if (!variants.includes(variantInput.trim())) {
//           setVariants((prevVariants) => [...prevVariants, variantInput.trim()]);
//           setVariantInput(""); // Clear input after adding
//         } else {
//           console.error("Variant already exists.");
//         }
//       } else {
//         console.error("Variant must be alphanumeric.");
//       }
//       e.preventDefault();
//     }
//   };

//   const handleRemoveVariant = (variantToRemove: string) => {
//     setVariants((prevVariants) =>
//       prevVariants.filter((variant) => variant !== variantToRemove)
//     );
//   };

//   const handleSubmit = async () => {
//     setError(null); // Clear error before submission

//     if (!newModelName || !vehicleType || !engineType || !description || !torque || !launchPrice || !horsepower || !seatingCapacity || colors.length === 0 || variants.length === 0 || (existingImages.length === 0 && images.length === 0)) {
//       setError("Please fill out all required fields.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("new_modelName", newModelName);
//     formData.append("vehicleType", vehicleType as string);
//     formData.append("engineType", engineType as string);
//     formData.append("description", description);
//     formData.append("torque", torque?.toString() || "");
//     formData.append("launchPrice", launchPrice?.toString() || "");
//     formData.append("horsepower", horsepower?.toString() || "");
//     formData.append("seatingCapacity", seatingCapacity?.toString() || "");

//     // Append variants and colors
//     variants.forEach((variant) => formData.append("variants", variant));
//     colors.forEach((color) => formData.append("colors", color));

//     // Append new images
//     images.forEach((image) => formData.append("images", image));

//     try {
//       const response = await fetch(`http://localhost:8000/vehicles/${brandName}/update-model/${modelName}`, {
//         method: "PUT",
//         body: formData,
//       });

//       if (response.ok) {
//         console.log("Model updated successfully!");
//         onClose(); // Close the modal after successful update
//       } else {
//         const errorData = await response.json();
//         setError(errorData.detail);
//       }
//     } catch (error) {
//       setError("An error occurred while updating the model.");
//     }
//   };

//   return (
//     <Modal size="5xl" isOpen={isOpen} onOpenChange={onClose}>
//       <ModalContent>
//         {(onCloseModal) => (
//           <>
//             <ModalHeader>Edit Model: {modelName} ({brandName})</ModalHeader>
//             <ModalBody>
//               <form className="flex flex-col gap-4">
//                 <Input
//                   label="Model Name"
//                   value={newModelName}
//                   onChange={(e) => setNewModelName(e.target.value)} // Editable field
//                   required
//                 />

//                 <div className="flex gap-5">
//                   <Select
//                     label="Vehicle Type"
//                     selectedKeys={vehicleType ? new Set([vehicleType]) : new Set([])}
//                     onSelectionChange={(keys) => {
//                       const selectedKey = Array.from(keys)[0];
//                       setVehicleType(selectedKey as string);
//                     }}
//                   >
//                     <SelectItem key="SUV">SUV</SelectItem>
//                     <SelectItem key="Sedan">Sedan</SelectItem>
//                     <SelectItem key="Compact">Compact</SelectItem>
//                   </Select>

//                   <Select
//                     label="Engine Type"
//                     selectedKeys={engineType ? new Set([engineType]) : new Set([])}
//                     onSelectionChange={(keys) => {
//                       const selectedKey = Array.from(keys)[0];
//                       setEngineType(selectedKey as string);
//                     }}
//                   >
//                     <SelectItem key="Petrol">Petrol</SelectItem>
//                     <SelectItem key="Diesel">Diesel</SelectItem>
//                     <SelectItem key="Electric">Electric</SelectItem>
//                   </Select>
//                 </div>

//                 <div className="flex gap-5">
//                   <Input
//                     label="Torque"
//                     type="number"
//                     value={torque?.toString() || ""}
//                     onChange={(e) => setTorque(e.target.value ? parseFloat(e.target.value) : undefined)}
//                   />

//                   <Input
//                     label="Launch Price"
//                     type="number"
//                     value={launchPrice?.toString() || ""}
//                     onChange={(e) => setLaunchPrice(e.target.value ? parseFloat(e.target.value) : undefined)}
//                   />

//                   <Input
//                     label="Horsepower"
//                     type="number"
//                     value={horsepower?.toString() || ""}
//                     onChange={(e) => setHorsepower(e.target.value ? parseFloat(e.target.value) : undefined)}
//                   />

//                   <Input
//                     label="Seating Capacity"
//                     type="number"
//                     value={seatingCapacity?.toString() || ""}
//                     onChange={(e) => setSeatingCapacity(e.target.value ? parseFloat(e.target.value) : undefined)}
//                   />
//                 </div>

//                 <Select
//                   label="Colors"
//                   multiple
//                   selectedKeys={new Set(colors)}
//                   onSelectionChange={(keys) => setColors(Array.from(keys) as string[])}
//                 >
//                   <SelectItem key="Black">Black</SelectItem>
//                   <SelectItem key="White">White</SelectItem>
//                   <SelectItem key="Red">Red</SelectItem>
//                   <SelectItem key="Blue">Blue</SelectItem>
//                   <SelectItem key="Gray">Gray</SelectItem>
//                 </Select>

//                 <Input
//                   type="file"
//                   multiple
//                   accept="image/png, image/jpeg"
//                   onChange={handleImageChange}
//                 />

//                 <div className="flex gap-2">
//                   {existingImages.map((image, index) => (
//                     <div key={index} className="relative">
//                       <img src={`data:image/jpeg;base64,${image}`} alt="Existing" width="100px" />
//                       <button
//                         className="absolute top-0 right-0 bg-red-500 text-white"
//                         onClick={() => handleRemoveImage(index, true)}
//                       >
//                         X
//                       </button>
//                     </div>
//                   ))}
//                   {images.map((image, index) => (
//                     <div key={index} className="relative">
//                       <img src={URL.createObjectURL(image)} alt="New" width="100px" />
//                       <button
//                         className="absolute top-0 right-0 bg-red-500 text-white"
//                         onClick={() => handleRemoveImage(index, false)}
//                       >
//                         X
//                       </button>
//                     </div>
//                   ))}
//                 </div>

//                 <Input
//                   label="Variants"
//                   value={variantInput}
//                   onChange={(e) => setVariantInput(e.target.value)}
//                   onKeyDown={handleAddVariant}
//                   endContent={
//                     <div className="flex gap-2">
//                       {variants.map((variant) => (
//                         <Chip
//                           key={variant}
//                           onClose={() => handleRemoveVariant(variant)}
//                           color="primary"
//                           variant="flat"
//                         >
//                           {variant}
//                         </Chip>
//                       ))}
//                     </div>
//                   }
//                 />

//                 <Textarea
//                   label="Description"
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                 />
//               </form>
//               {error && <div className="text-red-500">{error}</div>}
//             </ModalBody>
//             <ModalFooter>
//               <Button color="secondary" onPress={handleSubmit}>
//                 Update Model
//               </Button>
//               <Button color="secondary" onPress={onCloseModal}>
//                 Cancel
//               </Button>
//             </ModalFooter>
//           </>
//         )}
//       </ModalContent>
//     </Modal>
//   );
// };
