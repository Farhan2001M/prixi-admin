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
      setImages(validFiles);
    }
  };

  const handleAddVariant = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && variantInput.trim()) {
      if (/^[a-zA-Z0-9]+$/.test(variantInput)) {
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
    images.forEach((image, index) => {
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
































// import React, { useState } from "react";
// import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, Select, SelectItem } from "@nextui-org/react";

// type AddModelModalProps = {
//   isOpen: boolean;
//   onClose: () => void;
//   brandName: string;
// };

// export const AddModelModal: React.FC<AddModelModalProps> = ({ isOpen, onClose, brandName }) => {

//   const [modelName, setModelName] = useState<string>("");
//   const [vehicleType, setVehicleType] = useState<string | undefined>(undefined);
//   const [engineType, setEngineType] = useState<string | undefined>(undefined);
//   const [description, setDescription] = useState<string>("");
//   const [torque, setTorque] = useState<number | undefined>(undefined);
//   const [launchPrice, setLaunchPrice] = useState<number | undefined>(undefined);
//   const [horsepower, setHorsepower] = useState<number | undefined>(undefined);
//   const [seatingCapacity, setSeatingCapacity] = useState<number | undefined>(undefined);
//   const [variants, setVariants] = useState<string[]>([]);
//   const [colors, setColors] = useState<Set<string>>(new Set<string>());
//   const [images, setImages] = useState<File[]>([]);

//   const handleArrayInput = (value: string) => {
//     const array = value.split(",").map((item) => item.trim());
//     if (array.every((v) => /^[a-zA-Z0-9-]+$/.test(v))) {
//       setVariants(array);
//     } else {
//       console.error("Variants must be alphanumeric and separated by commas.");
//     }
//   };

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
//       setImages(validFiles);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!modelName || !vehicleType || !engineType || !description || !torque || !launchPrice || !horsepower || !seatingCapacity || colors.size === 0 || variants.length === 0 || images.length === 0) {
//       console.error("Please fill out all required fields.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("modelName", modelName);
//     formData.append("vehicleType", vehicleType as string);
//     formData.append("engineType", engineType as string);
//     formData.append("description", description);
//     formData.append("torque", torque?.toString() || "");
//     formData.append("launchPrice", launchPrice?.toString() || "");
//     formData.append("horsepower", horsepower?.toString() || "");
//     formData.append("seatingCapacity", seatingCapacity?.toString() || "");
//     formData.append("variants", variants.join(","));
//     formData.append("colors", Array.from(colors).join(","));

//     images.forEach((image, index) => {
//       formData.append(`images`, image);
//     });

//     try {
//       const response = await fetch(`http://localhost:8000/vehicles/${brandName}/add-model`, {
//         method: "POST",
//         body: formData,
//       });

//       if (response.ok) {
//         console.log("Model added successfully!");
//         onClose();
//       } else {
//         const errorData = await response.json();
//         console.error(errorData.detail);
//       }
//     } catch (error) {
//       console.error("Error adding model:", error);
//     }
//   };

//   return (
//     <>
//       <Modal size="5xl" isOpen={isOpen} onOpenChange={onClose}>
//         <ModalContent>
//           {(onCloseModal) => (
//             <>
//               <ModalHeader>Add New Model for {brandName}</ModalHeader>
//               <ModalBody>
//                 <form>
//                   <Input
//                     label="Model Name"
//                     placeholder="Enter model name"
//                     value={modelName}
//                     onChange={(e) => setModelName(e.target.value)}
//                     required
//                   />

//                   <Select
//                     label="Vehicle Type"
//                     placeholder="Select vehicle type"
//                     selectedKeys={vehicleType ? new Set([vehicleType]) : new Set([])}
//                     onSelectionChange={(keys) => {
//                       const selectedKey = Array.from(keys)[0]; // Convert the keys to an array and get the first item
//                       setVehicleType(selectedKey as string | undefined); // Ensure type safety
//                     }}
//                   >
//                     <SelectItem key="SUV">SUV</SelectItem>
//                     <SelectItem key="Sedan">Sedan</SelectItem>
//                     <SelectItem key="Compact">Compact</SelectItem>
//                   </Select>

//                   <Select
//                     label="Engine Type"
//                     placeholder="Select engine type"
//                     selectedKeys={engineType ? new Set([engineType]) : new Set([])}
//                     onSelectionChange={(keys) => {
//                       const selectedKey = Array.from(keys)[0]; // Convert the keys to an array and get the first item
//                       setEngineType(selectedKey as string | undefined); // Ensure type safety
//                     }}
//                   >
//                     <SelectItem key="Petrol">Petrol</SelectItem>
//                     <SelectItem key="Diesel">Diesel</SelectItem>
//                     <SelectItem key="Electric">Electric</SelectItem>
//                   </Select>

//                   <Textarea
//                     label="Description"
//                     placeholder="Enter a short description of the vehicle"
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                   />

//                   <Input
//                     label="Torque"
//                     type="number"
//                     placeholder="Enter torque value"
//                     value={torque?.toString() || ""}
//                     onChange={(e) => setTorque(e.target.value ? parseFloat(e.target.value) : undefined)}
//                     required
//                   />

//                   <Input
//                     label="Launch Price"
//                     type="number"
//                     placeholder="Enter launch price"
//                     value={launchPrice?.toString() || ""}
//                     onChange={(e) => setLaunchPrice(e.target.value ? parseFloat(e.target.value) : undefined)}
//                     required
//                   />

//                   <Input
//                     label="Horsepower"
//                     type="number"
//                     placeholder="Enter horsepower"
//                     value={horsepower?.toString() || ""}
//                     onChange={(e) => setHorsepower(e.target.value ? parseFloat(e.target.value) : undefined)}
//                     required
//                   />

//                   <Input
//                     label="Seating Capacity"
//                     type="number"
//                     placeholder="Enter seating capacity"
//                     value={seatingCapacity?.toString() || ""}
//                     onChange={(e) => setSeatingCapacity(e.target.value ? parseFloat(e.target.value) : undefined)}
//                     required
//                   />

//                   <Input
//                     label="Variants"
//                     placeholder="Enter variants (comma-separated)"
//                     onChange={(e) => handleArrayInput(e.target.value)}
//                   />

//                   <Select
//                     label="Colors"
//                     placeholder="Select colors"
//                     selectedKeys={colors}
//                     selectionMode="multiple"
//                     onSelectionChange={(keys) => setColors(new Set(keys as Set<string>))}
//                   >
//                     <SelectItem key="Black">Black</SelectItem>
//                     <SelectItem key="White">White</SelectItem>
//                     <SelectItem key="Red">Red</SelectItem>
//                     <SelectItem key="Blue">Blue</SelectItem>
//                     <SelectItem key="Gray">Gray</SelectItem>
//                   </Select>

//                   <Input
//                     type="file"
//                     multiple
//                     accept="image/png, image/jpeg"
//                     onChange={handleImageChange}
//                   />
//                 </form>
//               </ModalBody>
//               <ModalFooter>
//                 <Button color="secondary" onPress={handleSubmit}>
//                   Add Model
//                 </Button>
//                 <Button color="secondary" onPress={onCloseModal}>
//                   Cancel
//                 </Button>
//               </ModalFooter>
//             </>
//           )}
//         </ModalContent>
//       </Modal>
//     </>
//   );
// };






















// import React, { useState, useEffect } from "react";
// import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, Checkbox, } from "@nextui-org/react";
// import { ToastContainer, toast } from "react-toastify";


// type AddModelModalProps = {
//   isOpen: boolean;
//   onClose: () => void;
//   brandName: string;
// };

// export const AddModelModal: React.FC<AddModelModalProps> = ({ isOpen, onClose, brandName }) => {

//   const [modelName, setModelName] = useState("");
//   const [description, setDescription] = useState("");
//   const [launchPrice, setLaunchPrice] = useState("");
//   const [vehicleType, setVehicleType] = useState("");
//   const [seatingCapacity, setSeatingCapacity] = useState("");
//   const [engineType, setEngineType] = useState("");
//   const [colorsAvailable, setColorsAvailable] = useState<string[]>([]);
//   const [horsepower, setHorsepower] = useState("");
//   const [torque, setTorque] = useState("");
//   const [transmission, setTransmission] = useState("");
//   const [releaseDate, setReleaseDate] = useState("");
//   const [startingPrice, setStartingPrice] = useState("");
//   const [variants, setVariants] = useState<string[]>([]);
//   const [images, setImages] = useState<File[]>([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Validate image formats and size (<2MB, JPEG, PNG)
//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const files = event.target.files;
//     if (!files) return;

//     const validFiles: File[] = [];
//     for (let i = 0; i < files.length; i++) {
//       const file = files[i];
//       const isValidFormat = file.type === "image/jpeg" || file.type === "image/png";
//       const isValidSize = file.size < 2 * 1024 * 1024; // Less than 2MB

//       if (!isValidFormat || !isValidSize) {
//         toast.error("Only JPEG/PNG files under 2MB are allowed", { position: "bottom-right", autoClose: 3000, hideProgressBar: true, closeOnClick: true, pauseOnHover: false, draggable: false, style: { backgroundColor: "black", color: "white" }, });
//         continue;
//       }
//       validFiles.push(file);
//     }
//     setImages(validFiles);
//   };

//   const handleSubmit = async () => {
//     if (!modelName || !description || !launchPrice) {
//       toast.error("Please fill out all required fields", {
//         position: "bottom-right",
//         autoClose: 3000,
//         hideProgressBar: true,
//         closeOnClick: true,
//         pauseOnHover: false,
//         draggable: false,
//         style: { backgroundColor: "red", color: "white" },
//       });
//       return;
//     }
  
//     setIsSubmitting(true);
//     const formData = new FormData();
//     formData.append("brand_name", brandName.toLocaleLowerCase());
//     formData.append("model.modelName", modelName); // Updated to match expected payload structure
//     formData.append("model.description", description);
//     formData.append("model.launchPrice", launchPrice); // Updated to match expected payload structure
//     formData.append("model.vehicleType", vehicleType); // Updated to match expected payload structure
//     formData.append("model.seatingCapacity", seatingCapacity); // Updated to match expected payload structure
//     formData.append("model.engineType", engineType); // Updated to match expected payload structure
//     formData.append("model.colorsAvailable", JSON.stringify(colorsAvailable)); // Updated to match expected payload structure
//     formData.append("model.horsepower", horsepower); // Updated to match expected payload structure
//     formData.append("model.torque", torque); // Updated to match expected payload structure
//     formData.append("model.transmission", transmission); // Updated to match expected payload structure
//     formData.append("model.releaseDate", releaseDate); // Updated to match expected payload structure
//     formData.append("model.startingPrice", startingPrice); // Updated to match expected payload structure
//     formData.append("model.variants", JSON.stringify(variants)); // Updated to match expected payload structure
//     images.forEach((file) => formData.append("images", file)); // Ensure the key matches
  
//     try {
//       const response = await fetch("http://localhost:8000/addVehiclemodel", {
//         method: "POST",
//         body: formData,
//       });
  
//       const result = await response.json();
  
//       if (response.ok) {
//         toast.success(result.message, {
//           position: "bottom-right",
//           autoClose: 3000,
//           hideProgressBar: true,
//           closeOnClick: true,
//           pauseOnHover: false,
//           draggable: false,
//           style: { backgroundColor: "green", color: "white" },
//         });
//         onClose();
//       } else {
//         toast.error(result.detail || "Failed to add model", {
//           position: "bottom-right",
//           autoClose: 3000,
//           hideProgressBar: true,
//           closeOnClick: true,
//           pauseOnHover: false,
//           draggable: false,
//           style: { backgroundColor: "red", color: "white" },
//         });
//       }
//     } catch (error) {
//       toast.error("An error occurred while adding the model", {
//         position: "bottom-right",
//         autoClose: 3000,
//         hideProgressBar: true,
//         closeOnClick: true,
//         pauseOnHover: false,
//         draggable: false,
//         style: { backgroundColor: "red", color: "white" },
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
  

//   // Clear form on close
//   useEffect(() => {
//     if (!isOpen) { setModelName(""); setDescription(""); setLaunchPrice(""); setVehicleType(""); setSeatingCapacity(""); setEngineType(""); setColorsAvailable([]); setHorsepower(""); setTorque(""); setTransmission(""); setReleaseDate(""); setStartingPrice(""); setVariants([]); setImages([]); }
//   }, [isOpen]);

//   return (
//     <>
//       <Modal size="5xl" isOpen={isOpen} onOpenChange={onClose}>
//         <ModalContent>
//           {(onCloseModal) => (
//             <>
//               <ModalHeader>Add New Model for {brandName}</ModalHeader>
//               <ModalBody>
//                 <div className="flex">
//                   <Input label="Model Name" value={modelName} onChange={(e) => setModelName(e.target.value)} required />
//                   <Input label="Vehicle Type" value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} />
//                 </div>
//                 <div className="flex">
//                   <Input label="Launch Price" value={launchPrice} onChange={(e) => setLaunchPrice(e.target.value)} required />
//                   <Input label="Starting Price" value={startingPrice} onChange={(e) => setStartingPrice(e.target.value)} />
//                 </div>

//                 <div className="flex">
//                   <Input label="Seating Capacity" value={seatingCapacity} onChange={(e) => setSeatingCapacity(e.target.value)} />
//                   <Input label="Engine Type" value={engineType} onChange={(e) => setEngineType(e.target.value)} />
//                 </div>
//                 <div className="flex">
//                   <Input label="Horsepower" value={horsepower} onChange={(e) => setHorsepower(e.target.value)} />
//                   <Input label="Torque" value={torque} onChange={(e) => setTorque(e.target.value)} />
//                 </div>
//                 <div className="flex">
//                   <Input label="Colors Available (comma separated)" onChange={(e) => setColorsAvailable(e.target.value.split(","))} />
//                   <Input label="Variants (comma separated)" onChange={(e) => setVariants(e.target.value.split(","))} />
//                 </div>
//                 <div className="flex">
//                   <Input label="Transmission" value={transmission} onChange={(e) => setTransmission(e.target.value)} />
//                   <Input label="Release Date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} />
//                 </div>
//                 <Input type="file" multiple accept="image/jpeg,image/png" onChange={handleFileChange} />
//                 <Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
//               </ModalBody>
//               <ModalFooter>
//                 <Button
//                   color="primary"
//                   onClick={handleSubmit}
//                   isDisabled={isSubmitting || !modelName || !description || !launchPrice}
//                 >
//                   {isSubmitting ? "Adding..." : "Add Model"}
//                 </Button>
//                 <Button color="secondary" onPress={onCloseModal}>
//                   Cancel
//                 </Button>
//               </ModalFooter>
//             </>
//           )}
//         </ModalContent>
//       </Modal>
//       <ToastContainer />
//     </>
//   );
// };
