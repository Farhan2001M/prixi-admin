
import React, { useState , useEffect} from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, Select, SelectItem, Chip } from "@nextui-org/react";

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
  const [images, setImages] = useState<File[]>([]);

  // Clear form on close
  useEffect(() => {
    if (!isOpen) { setModelName(""); setDescription(""); setVariantInput(""); setLaunchPrice(undefined); setVehicleType(undefined); setSeatingCapacity(undefined); setEngineType(undefined); setColors([]); setHorsepower(undefined); setTorque(undefined); setYear(undefined); setVariants([]); setImages([]); }
  }, [isOpen]);

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
  //     setImages(validFiles);
  //   }
  // };


  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const selectedFiles: File[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!["image/jpeg", "image/png"].includes(file.type)) {
          console.error(`File ${file.name} must be a PNG or JPEG.`);
        } else {
          selectedFiles.push(file); // Keep the file regardless of size for now
        }
      }
      setImages(selectedFiles);
    }
  };
  
  const handleAddVariant = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && variantInput.trim()) {
      if (/^(?=.*[a-zA-Z0-9])[a-zA-Z0-9]+([-#%&][a-zA-Z0-9]+)*(\s[a-zA-Z0-9]+([-#%&][a-zA-Z0-9]+)*)*$/.test(variantInput)) {
        if (variants.includes(variantInput.trim())) {
          console.error("Variant already exists.");
        } else {
          setVariants((prevVariants) => [...prevVariants, variantInput.trim()]);
          setVariantInput(""); // Clear the input after adding
        }
      } else {
        console.error("Variant must be alphanumeric.");
      }
      e.preventDefault(); // Prevent form submission when pressing Enter
    }
  };

  const handleRemoveVariant = (variantToRemove: string) => {
    setVariants((prevVariants) => prevVariants.filter((variant) => variant !== variantToRemove));
  };

  const handleSubmit = async () => {
    if (!modelName || !vehicleType || !engineType || !description || !torque || !year || !launchPrice || !horsepower || !seatingCapacity || colors.length === 0 || variants.length === 0) {
      console.error("Please fill out all required fields.");
      return;
    }

    // Validation checks for the specified ranges
    if (torque < 100 || torque > 2500) { console.error("Torque must be between 100 and 2500."); return; }
    if (horsepower < 50 || horsepower > 1800) { console.error("Horsepower must be between 50 and 1800."); return; }
    if (seatingCapacity < 2 || seatingCapacity > 9) { console.error("Seating capacity must be between 2 and 9."); return; }
    if (launchPrice < 2500 || launchPrice > 50000000) { console.error("Launch price must be between 2500 and 50,000,000."); return; }
    if (year < 1980 || year > 2025) { console.error("Year must be between 1980 and 2025."); return;}


    // Image validation - Check if any image exceeds the 2MB size limit
    const oversizedImages = images.filter((image) => image.size > 2 * 1024 * 1024);
    console.log(oversizedImages);
    if (oversizedImages.length > 0) {
      console.log("i runned")
      oversizedImages.forEach((image) => {
          console.error(`File ${image.name} exceeds 2MB.`);
        }
      );
      return; // Return early if any image exceeds the size limit
    }


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

    // Append images
    images.forEach((image) => {
      formData.append(`images`, image);
    });

    try {
      const response = await fetch(`http://localhost:8000/vehicles/${brandName}/add-model`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Model added successfully!");
        onClose();
        onAddModel();
      } else {
        const errorData = await response.json();
        console.error(errorData.detail);
      }
    } catch (error) {
      console.error("Error adding model:", error);
    }
  };

  return (
    <>
      <Modal size="5xl" isOpen={isOpen} onOpenChange={onClose}>
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
                      type="file"
                      multiple
                      accept="image/png, image/jpeg"
                      onChange={handleImageChange}
                      isClearable
                      classNames={{ inputWrapper: [ "py-7"]}}
                    />
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




