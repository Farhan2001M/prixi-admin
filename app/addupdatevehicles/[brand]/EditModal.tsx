import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, Select, SelectItem, Chip, } from "@nextui-org/react";
import { CustomToast , CustomToastContainer } from "../../components/CustomToastService"; // Import CustomToast for success and error notifications

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
  const [year, setYear] = useState<number | undefined>(undefined);
  const [launchPrice, setLaunchPrice] = useState<number | undefined>(undefined);
  const [horsepower, setHorsepower] = useState<number | undefined>(undefined);
  const [seatingCapacity, setSeatingCapacity] = useState<number | undefined>(undefined);
  const [variants, setVariants] = useState<string[]>([]);
  const [variantInput, setVariantInput] = useState<string>("");
  const [colors, setColors] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]); // Store current images
  const [error, setError] = useState<string | null>(null); // Error state
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState<string>("");

  // Fetch existing model data when modal is opened
  useEffect(() => {
    if (isOpen) {
      const fetchModelData = async () => {
        const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ;
        setImageUrls([]); // Clear image URLs when opening the modal
        try {
          const response = await fetch(`${BASE_URL}/vehicles/${brandName}/${modelName}`);
          if (response.ok) {
            const data = await response.json();
            setNewModelName(data.modelName); // Set initial model name
            setVehicleType(data.vehicleType);
            setEngineType(data.engineType);
            setDescription(data.description);
            setTorque(data.torque);
            setYear(data.year);
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

  const handleImageUrlPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("text");
    const urlRegex = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/i;
  
    if (!urlRegex.test(pastedText)) {
      CustomToast.error("Invalid URL. Please paste a valid image URL.");
      e.preventDefault(); // Prevent pasting non-URL text
      return;
    }
  
    if (imageUrls.length + existingImages.length >= 5) {
      CustomToast.error("You can only add up to 5 image URLs.");
      e.preventDefault(); // Prevent pasting more than 5 URLs
      return;
    }
  
    setImageUrls((prevUrls) => [...prevUrls, pastedText.trim()]);
    setImageUrlInput(""); // Clear the input after adding
  };

  // const handleRemoveImageUrl = (urlToRemove: string) => {
  //   setImageUrls((prevUrls) => prevUrls.filter((url) => url !== urlToRemove));
  // };

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

    if (!newModelName || !vehicleType || !engineType || !description || !torque || !year || !launchPrice || !horsepower || !seatingCapacity || colors.length === 0 || variants.length === 0 || (existingImages.length === 0 && imageUrls.length === 0)) {
      setError("Please fill out all required fields.");
      return;
    }

    // Validation checks for the specified ranges
    if (torque < 100 || torque > 2500) { console.error("Torque must be between 100 and 2500."); return; }
    if (horsepower < 50 || horsepower > 1800) { console.error("Horsepower must be between 50 and 1800."); return; }
    if (seatingCapacity < 2 || seatingCapacity > 9) { console.error("Seating capacity must be between 2 and 9."); return; }
    if (launchPrice < 2500 || launchPrice > 50000000) { console.error("Launch price must be between 2500 and 50,000,000."); return; }
    if (year < 1980 || year > 2025) { console.error("Year must be between 1980 and 2025."); return;}


    const formData = new FormData();
    formData.append("new_modelName", newModelName);
    formData.append("vehicleType", vehicleType as string);
    formData.append("engineType", engineType as string);
    formData.append("description", description);
    formData.append("torque", torque?.toString() || "");
    formData.append("year", year?.toString() || "");
    formData.append("launchPrice", launchPrice?.toString() || "");
    formData.append("horsepower", horsepower?.toString() || "");
    formData.append("seatingCapacity", seatingCapacity?.toString() || "");

    // Append variants and colors
    variants.forEach((variant) => formData.append("variants", variant));
    colors.forEach((color) => formData.append("colors", color));

     // Append new images and existing images
    [...existingImages, ...imageUrls].forEach((imageUrl) => formData.append("imageUrls", imageUrl)); // Merging both arrays before appending

    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ;
      const response = await fetch(`${BASE_URL}/vehicles/${brandName}/update-model/${modelName}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        CustomToast.success("Model updated successfully!");
        onClose(); // Close the modal after successful update
        onEdit();
      } else {
        const errorData = await response.json();
        setError(errorData.detail);
      }
    } catch{
      setError("An error occurred while updating the model.");
    }
  };

 
  

  return (
    <>
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
                      label="Year"
                      type="number"
                      placeholder="Enter Year value"
                      value={year?.toString() || ""}
                      onChange={(e) => setYear(e.target.value ? parseFloat(e.target.value) : undefined)}  
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

                  
                  <div className="flex gap-5">
                    <Input
                      label="Image URLs"
                      placeholder="Paste image URL here"
                      value={imageUrlInput}
                      onPaste={handleImageUrlPaste}
                      onFocus={() => setImageUrlInput("")} // Optional: Reset or handle focus event if needed
                    />

                    <div className="flex justify-between">
                      <div className="flex gap-2">
                        {existingImages.map((imageUrl, index) => (
                          <div
                            key={index}
                            className="relative w-14 h-14" // Tailwind classes for square container (6rem x 6rem)
                          >
                            <img 
                              src={imageUrl} 
                              alt="Existing" 
                              className="w-full h-full object-cover rounded-md" // Tailwind classes to fill the container with the image, maintaining the aspect ratio
                            />
                          </div>
                        ))}

                        {imageUrls.map((imageUrl, index) => (
                          <div
                            key={index}
                            className="relative w-14 h-14 " // Tailwind classes for square container (6rem x 6rem)
                          >
                            <img 
                              src={imageUrl} 
                              alt="New" 
                              className="w-full h-full object-cover rounded-md" // Tailwind classes to fill the container with the image, maintaining the aspect ratio
                            />
                          </div>
                        ))}
                      </div>
                    </div>
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
                            color="success"
                            variant="solid"
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
      {/* ToastContainer for notifications */}
      <CustomToastContainer />
    </>
  );
};




// const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = event.target.files;
  //   if (files) {
  //     const validFiles: File[] = [];
  //     for (let i = 0; i < files.length; i++) {
  //       const file = files[i];
  //       if (file.size > 2 * 1024 * 1024) {
  //         console.error(`File ${file.name} exceeds 2MB.`);
  //       } else if (!["image/jpeg", "image/png"].includes(file.type)) {
  //         console.error(`File ${file.name} must be a PNG or JPEG.`);
  //       } else {
  //         validFiles.push(file);
  //       }
  //     }
  //     setImages((prev) => [...prev, ...validFiles]); // Append new images
  //   }
  // };

