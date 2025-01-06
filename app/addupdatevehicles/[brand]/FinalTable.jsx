
import React from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem, User, Chip ,Tooltip, Input, Pagination} from "@nextui-org/react";
import {ChevronDownIcon} from "../../components/NeXTUI/ChevronDownIcon";
import {SearchIcon} from "../../components/NeXTUI/SearchIcon";
import {PlusIcon} from "../../components/NeXTUI/PlusIcon";
import {EditIcon} from "../../components/NeXTUI/EditIcon";
import {DeleteIcon} from "../../components/NeXTUI/DeleteIcon";
import {EyeIcon} from "../../components/NeXTUI/EyeIcon";
import { AddModelModal } from "./AddModel"; 
import { ViewModelModal } from "./ViewModal"; 
import { EditModelModal } from "./EditModal"; 
import { DeleteModelModal } from './DeleteHandle';

// Initial visible columns - only a few are shown by default
const INITIAL_VISIBLE_COLUMNS = new Set(["modelName", "vehicleType", "engineType", "launchPrice" , "actions"]);

const statusColorMap = {
  Electric: "success",
  Diesel: "warning",
  Petrol: "danger",
  Hybrid: "secondary",
};

// Define the vehicle types for the dropdown
const vehicleTypeOptions = [
  { uid: "SUV", name: "SUV" },
  { uid: "Sedan", name: "Sedan" },
  { uid: "Compact", name: "Compact" },
  { uid: "Coupe", name: "Coupe" },
  { uid: "Hatchback", name: "Hatchback" },
  { uid: "Pickup-Truck", name: "Pickup-Truck" },
];


const columns = [
  { name: "Model Name", uid: "modelName", sortable: true },
  { name: "Vehicle Type", uid: "vehicleType", sortable: true },
  { name: "Launch Price", uid: "launchPrice", sortable: true },
  { name: "Engine Type", uid: "engineType", sortable: true },
  { name: "Torque", uid: "torque", sortable: true },
  { name: "Year", uid: "year", sortable: true },
  { name: "Horsepower", uid: "horsepower", sortable: true },
  { name: "Variants", uid: "variants", sortable: true },
  { name: "Colors", uid: "colors", sortable: true },
  { name: "Images", uid: "images", sortable: true },
  { name: "Comments", uid: "comments", sortable: true },
  { name: "Actions", uid: "actions", sortable: false },
];

export default function App({ brandData , refreshModels }) {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "modelName",
    direction: "ascending",
  });
  const [filterValue, setFilterValue] = React.useState("");
  const [visibleColumns, setVisibleColumns] = React.useState(INITIAL_VISIBLE_COLUMNS);
  const [vehicleTypeFilter, setVehicleTypeFilter] = React.useState("all"); // Vehicle Type Filter
  const [page, setPage] = React.useState(1); // Current page
  const [rowsPerPage, setRowsPerPage] = React.useState(5); // Rows per page

  const handleReset = () => {
    setSelectedKeys(new Set([]));
    setSortDescriptor({ column: "modelName", direction: "ascending" });
    setFilterValue("");
    setVisibleColumns(INITIAL_VISIBLE_COLUMNS);
    setVehicleTypeFilter("all");
    setPage(1);
    setRowsPerPage(5);
  };

  // Ensure that brandData.brandName and brandData.models are defined before using them
  const brandname = brandData?.brandName ?? "";
  const models = brandData?.models ?? [];

  const filteredModels = React.useMemo(() => {
    let filtered = models;
    // Filter by search input
    if (filterValue) {
      filtered = filtered.filter((model) =>
        model.modelName.toLowerCase().includes(filterValue.toLowerCase())
      ); }
    // Filter by selected vehicle types
    if (vehicleTypeFilter.size > 0) {
      filtered = filtered.filter((model) =>
        Array.from(vehicleTypeFilter).includes(model.vehicleType)
      ); }
    return filtered;
  }, [models, filterValue, vehicleTypeFilter]);

  // Sorting the items based on sortDescriptor
  const sortedModels = React.useMemo(() => {
    return [...filteredModels].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredModels]);

  // Pagination logic: slice the models based on the page and rows per page
  const paginatedModels = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedModels.slice(start, end);
  }, [sortedModels, page, rowsPerPage]);


  // Function to handle column visibility change
  const onColumnVisibilityChange = (columnKey) => {
    const updatedVisibleColumns = new Set(visibleColumns);
    if (updatedVisibleColumns.has(columnKey)) {
      updatedVisibleColumns.delete(columnKey); // Uncheck column
    } else {
      updatedVisibleColumns.add(columnKey); // Check column      
    }
    // Ensure at least one column remains visible
    if (updatedVisibleColumns.size === 0) {
      updatedVisibleColumns.add("modelName"); // Default to modelName or any other column
    }
    setVisibleColumns(updatedVisibleColumns);
  };

  const headerColumns = React.useMemo(() => {
    return columns.filter((column) => visibleColumns.has(column.uid));
  }, [visibleColumns]);


  // Function to render cell content based on columnKey
  const renderCell = React.useCallback((model, columnKey , brandname) => {
    const cellValue = model[columnKey];

    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex items-center gap-3">
            <Tooltip color="success" closeDelay={100} content="See Details">
              <span onClick={ () => { handleView(model.modelName , brandname); } } className="text-lg text-success cursor-pointer active:opacity-50">
                <EyeIcon />
              </span>
            </Tooltip>
            <Tooltip color="warning" closeDelay={100} content="Edit model">
              <span onClick={ () => { handleEdit(model.modelName , brandname); } } className="text-lg text-warning cursor-pointer active:opacity-50">
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" closeDelay={100} content="Delete model">
              <span onClick={ () => { handleDelete(model.modelName , brandname); } } className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteIcon style={{ color: 'red' }} />
              </span>
            </Tooltip>
          </div>
        );
      case "modelName":
        return (
          <User
            avatarProps={{ 
              radius: "md", 
              src: model.images.length > 0 ? model.images[0] : null 
            }}
            name={cellValue}
          >
          </User>
        );
      case "engineType":
        return (
          <Chip className="capitalize" color={statusColorMap[model.engineType]} size="sm" variant="flat">
            {cellValue}
          </Chip>
        );
      case "variants":
        return model.variants.length; // Show count of variants
      case "colors":
        return model.colors.length; // Show count of colors
      case "images":
        return model.images.length; // Show count of images
        case "comments":
          return model.comments ? model.comments.length : 0; // Return length of comments or 0 if not present
      default:
        return cellValue;
    }
  }, []);

  const pages = Math.ceil(sortedModels.length / rowsPerPage);

  // Function to handle search input change
  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);
  
  const onClear = React.useCallback(()=>{
    setFilterValue("")
    setPage(1)
  },[])

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const [selectedBrand, setSelectedBrand] = React.useState(null);
  const [selectedModel, setSelectedModel] = React.useState(null);

  {/* Functionality For Adding a new model */}{/* Functionality For Adding a new model */}
  const [isAddNewModalOpen, setIsAddNewModalOpen] = React.useState(null);
  const handleAddNewmodel = (brand) => {
    console.log(`Brand is of brand: `, brand);
    setSelectedBrand(brand);
    setIsAddNewModalOpen(true); // Open the modal when the button is clicked
  };
  const closeAddNewModal = () => {
    setIsAddNewModalOpen(false); // Close the modal
  };
  const handleAddModel = () => {  
    console.log("Model Edited successfully!");
    refreshModels();
  };

  {/* Functionality For View modal */}{/* Functionality For View modal */}
  const [isViewModalOpen, setIsViewModalOpen] = React.useState(false);
  const handleView = (model, brand) => {
    console.log("model is " ,model)
    console.log("brand is " ,brand)
    setSelectedModel(model); // Set model name
    setSelectedBrand(brand);  // Set brand name
    setIsViewModalOpen(true); // Open the modal
  };
  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
  };

  {/* Functionality For Editing the modal */}{/* Functionality For Editing the modal */}
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const handleEdit = (model, brand) => {
    console.log("model is " ,model)
    console.log("brand is " ,brand)
    setSelectedModel(model); // Set model name
    setSelectedBrand(brand);  // Set brand name
    setIsEditModalOpen(true);  // Open the modal
  };
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };
  const handleModelEdit = () => {  
    console.log("Model Edited successfully!");
    refreshModels();
  };

  {/* Functionality For Delete modal */}{/* Functionality For Delete modal */}
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const handleDelete = (model, brand) => {
    setSelectedBrand(brand);
    setSelectedModel(model);
    setIsDeleteModalOpen(true);  // Open the modal when the Delete icon is clicked
  };
  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false); // Close modal
  };
  const handleModelDelete = () => {  
    console.log("Model deleted successfully!");
    refreshModels();
  };

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by model name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          
          <div className="flex gap-3">
            {/* Dropdown to filter by vehicle type */}
            <Dropdown>
              <DropdownTrigger>
                <Button endContent={<ChevronDownIcon />} variant="flat">
                  Vehicle Type
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Filter by Vehicle Type"
                closeOnSelect={false}
                selectionMode="multiple"
                selectedKeys={vehicleTypeFilter}
                onSelectionChange={setVehicleTypeFilter} // Update the selected keys
              >
                {vehicleTypeOptions.map((type) => (
                  <DropdownItem key={type.uid}>
                    {type.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <Dropdown>
              <DropdownTrigger>
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Table Columns"
                disallowEmptySelection
                selectionMode="multiple"
                selectedKeys={visibleColumns}
                closeOnSelect={false} 
                // onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem
                    key={column.uid}
                    onClick={() => onColumnVisibilityChange(column.uid)}
                  >
                    {column.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button onClick={ ()=> handleAddNewmodel(brandname)} color="primary" endContent={<PlusIcon />}>
              Add New Model
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {models.length} models</span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [ filterValue, vehicleTypeFilter, visibleColumns, onRowsPerPageChange, models.length, onSearchChange ]);

  // Bottom content for pagination and selected item count
  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${sortedModels.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          total={pages}
          page={page}
          onChange={setPage} // Set page on change
        />
        
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          {/* <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
            Previous
          </Button>
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
            Next
          </Button> */}
          <Button 
            variant="bordered" 
            color="primary" 
            onClick={handleReset}
          >
            Reset Table
          </Button>
        </div>

        
      </div>
    );
  }, [selectedKeys, sortedModels.length, vehicleTypeFilter, page, pages, rowsPerPage]);

  return (
    <div>
      <Table
        aria-label="Models Table"
        selectionMode="single"
        selectedKeys={selectedKeys}
        sortDescriptor={sortDescriptor}
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        topContent={topContent}
        topContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[782px]",
        }}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn key={column.uid} allowsSorting={column.sortable}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No models found"} items={paginatedModels}>
          {(item) => (
            <TableRow key={item.modelName}>
              {(columnKey) => visibleColumns.has(columnKey) && <TableCell>{renderCell(item, columnKey , brandname)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Render the AddModelModal component */}
      <AddModelModal 
        brandName={selectedBrand} 
        isOpen={isAddNewModalOpen} 
        onClose={closeAddNewModal}
        onAddModel={handleAddModel}
      />

      {/* Render the View modal */}
      <ViewModelModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        modelName={selectedModel}
        brandName={selectedBrand}
      />

      {/* Render the View modal */}
      <EditModelModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        modelName={selectedModel}
        brandName={selectedBrand}
        onEdit={handleModelEdit}
      />


      {/* Render the Delete modal */}
      <DeleteModelModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        model={selectedModel}
        brand={selectedBrand}
        onDelete={handleModelDelete}
      />

    </div>
  );
}


