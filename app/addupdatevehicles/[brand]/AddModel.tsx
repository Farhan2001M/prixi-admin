
import React, { useState , useEffect} from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, Select, SelectItem, Chip } from "@nextui-org/react";
import { CustomToast } from "../../components/CustomToastService"; // Import CustomToast for success and error notifications

type AddModelModalProps = {
  isOpen: boolean;
  onClose: () => void;
  brandName: string;
  onAddModel: () => void;
};

export const AddModelModal: React.FC<AddModelModalProps> = ({ isOpen, onClose, brandName , onAddModel}) => {
  const [modelName, setModelName] = useState<string>("");
  const [vehicleType, setVehicleType] = useState<string | undefined>(undefined);
  const [engineType, setEngineType] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState<string>("");
  const [torque, setTorque] = useState<number | undefined>(undefined);
  const [year, setYear] = useState<number | undefined>(undefined);
  const [launchPrice, setLaunchPrice] = useState<number | undefined>(undefined);
  const [horsepower, setHorsepower] = useState<number | undefined>(undefined);
  const [seatingCapacity, setSeatingCapacity] = useState<number | undefined>(undefined);
  const [variants, setVariants] = useState<string[]>([]);
  const [variantInput, setVariantInput] = useState<string>(""); // Track the variant input field
  const [colors, setColors] = useState<string[]>([]); // Changed to array instead of Set
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState<string>("");

  // Clear form on close
  useEffect(() => {
    if (!isOpen) { setModelName(""); setDescription(""); setVariantInput(""); setLaunchPrice(undefined); setVehicleType(undefined); setSeatingCapacity(undefined); setEngineType(undefined); setColors([]); setHorsepower(undefined); setTorque(undefined); setYear(undefined); setVariants([]); setImageUrls([]);  setImageUrlInput(""); }
  }, [isOpen]);

  const handleImageUrlPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("text");
    const urlRegex = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/i;
  
    if (!urlRegex.test(pastedText)) {
      CustomToast.error("Invalid URL. Please paste a valid image URL.");
      e.preventDefault(); // Prevent pasting non-URL text
      return;
    }
  
    if (imageUrls.length >= 5) {
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
      if (/^(?=.*[a-zA-Z0-9])[a-zA-Z0-9]+([-#%&][a-zA-Z0-9]+)*(\s[a-zA-Z0-9]+([-#%&][a-zA-Z0-9]+)*)*$/.test(variantInput)) {
        if (variants.includes(variantInput.trim())) {
          CustomToast.error("Variant already exists."); // Show error toast
        } else {
          setVariants((prevVariants) => [...prevVariants, variantInput.trim()]);
          setVariantInput(""); // Clear the input after adding
        }
      } else {
        CustomToast.error("Variant must be alphanumeric."); // Show error toast
      }
      e.preventDefault(); // Prevent form submission when pressing Enter
    }
  };

  const handleRemoveVariant = (variantToRemove: string) => {
    setVariants((prevVariants) => prevVariants.filter((variant) => variant !== variantToRemove));
  };

  const handleSubmit = async () => {
    if (!modelName || !vehicleType || !engineType || !description || !torque || !year || !launchPrice || !horsepower || !seatingCapacity || colors.length === 0 || variants.length === 0 || imageUrls.length === 0 ) {
      CustomToast.error("Please fill out all required fields."); // Show error toast
      return;
    }

    // Validation checks for the specified ranges
    if (torque < 100 || torque > 2500) { CustomToast.error("Torque must be between 100 and 2500."); return; }
    if (horsepower < 50 || horsepower > 1800) { CustomToast.error("Horsepower must be between 50 and 1800."); return; }
    if (seatingCapacity < 2 || seatingCapacity > 9) { CustomToast.error("Seating capacity must be between 2 and 9."); return; }
    if (launchPrice < 2500 || launchPrice > 50000000) { CustomToast.error("Launch price must be between 2500 and 50,000,000."); return; }
    if (year < 1980 || year > 2025) { CustomToast.error("Year must be between 1980 and 2025."); return;}


    


    const formData = new FormData();
    formData.append("modelName", modelName.trim());
    formData.append("vehicleType", vehicleType as string);
    formData.append("engineType", engineType as string);
    formData.append("description", description.trim());
    formData.append("torque", torque?.toString() || "");
    formData.append("year", year?.toString() || "");
    formData.append("launchPrice", launchPrice?.toString() || "");
    formData.append("horsepower", horsepower?.toString() || "");
    formData.append("seatingCapacity", seatingCapacity?.toString() || "");

    // Append variants as individual fields in FormData
    variants.forEach((variant) => {
      formData.append("variants", variant);
    });

    // Append colors as individual fields in FormData
    colors.forEach((color) => {
      formData.append("colors", color);
    });

    imageUrls.forEach((imageUrl) => {
      formData.append("imageUrls", imageUrl);
    });

    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ;
    console.log("Data being sent:", formData);
    try {
      const response = await fetch(`${BASE_URL}/vehicles/${brandName}/add-model`, {
        method: "POST",
        body: formData,
      });
    
      if (response.ok) {
        CustomToast.success("Model added successfully!");
        onClose();
        onAddModel();
      } else {
        const errorData = await response.json();
        CustomToast.error(errorData.detail || "Error adding model.");
      }
    } catch (error) {
      CustomToast.error("Error adding model: " + error);
    }
  };

  return (
    <>
      <Modal size="5xl" isOpen={isOpen} isDismissable={false} onOpenChange={onClose}>
        <ModalContent>
          {(onCloseModal) => (
            <>
              <ModalHeader>Add New Model for {brandName}</ModalHeader>
              <ModalBody>
                <form className="flex flex-col gap-4">
                  <Input
                    label="Model Name"
                    placeholder="Enter model name"
                    value={modelName}
                    onChange={(e) => setModelName(capitalizeModelName(e.target.value))}
                    required
                  />

                  <div className="flex gap-5">
                    <Select
                      label="Vehicle Type"
                      placeholder="Select vehicle type"
                      selectedKeys={vehicleType ? new Set([vehicleType]) : new Set([])}
                      onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0]; // Convert the keys to an array and get the first item
                        setVehicleType(selectedKey as string | undefined); // Ensure type safety
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
                      placeholder="Select engine type"
                      selectedKeys={engineType ? new Set([engineType]) : new Set([])}
                      onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0]; // Convert the keys to an array and get the first item
                        setEngineType(selectedKey as string | undefined); // Ensure type safety
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
                      placeholder="Enter torque value"
                      value={torque?.toString() || ""}
                      onChange={(e) => setTorque(e.target.value ? parseFloat(e.target.value) : undefined)}
                      required
                    />

                    <Input
                      label="Year"
                      type="number"
                      placeholder="Enter Year value"
                      value={year?.toString() || ""}
                      onChange={(e) => setYear(e.target.value ? parseFloat(e.target.value) : undefined)}
                      required
                    />

                    <Input
                      label="Launch Price"
                      type="number"
                      placeholder="Enter launch price"
                      value={launchPrice?.toString() || ""}
                      onChange={(e) => setLaunchPrice(e.target.value ? parseFloat(e.target.value) : undefined)}
                      required
                    />

                    <Input
                      label="Horsepower"
                      type="number"
                      placeholder="Enter horsepower value"
                      value={horsepower?.toString() || ""}
                      onChange={(e) => setHorsepower(e.target.value ? parseFloat(e.target.value) : undefined)}
                      required
                    />

                    <Input
                      label="Seating Capacity"
                      type="number"
                      placeholder="Enter seating capacity"
                      value={seatingCapacity?.toString() || ""}
                      onChange={(e) => setSeatingCapacity(e.target.value ? parseFloat(e.target.value) : undefined)}
                      required
                    />
                  </div>

                  <div className="flex gap-5">
                    <Select
                      label="Colors"
                      selectionMode="multiple"
                      placeholder="Select colors available"
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
                      label="Image URLs"
                      placeholder="Paste image URL here"
                      value={imageUrlInput}
                      onPaste={handleImageUrlPaste}
                      onFocus={() => setImageUrlInput("")} // Optional: Reset or handle focus event if needed
                    />
                    <div>{imageUrls.length} / 5 URLs added</div>

                  </div>

                  <Input
                    label="Variants"
                    placeholder="Enter variants names and press Enter"
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
                    placeholder="Enter a description of the vehicle"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />

                </form>
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" onPress={handleSubmit}>
                  Add Model
                </Button>
                <Button color="secondary" onPress={onCloseModal}>
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {/* ToastContainer for notifications
      <CustomToastContainer /> */}
    </>
  );
};


const capitalizeModelName = (name: string) => {
  return name
    .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
};
