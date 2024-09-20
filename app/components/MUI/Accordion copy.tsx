import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
} from "@nextui-org/react";
import { PlusIcon } from "./PlusIcon";
import { VerticalDotsIcon } from "./VerticalDotsIcon";
import { SearchIcon } from "./SearchIcon";
import { ChevronDownIcon } from "./ChevronDownIcon";
import { models, vehicleTypes, statusOptions } from "./data";
import { capitalize } from "./utils";

const statusColorMap: Record<string, string> = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

const INITIAL_VISIBLE_COLUMNS = ["model", "vehicleType", "launchPrice", "actions"];

export default function App() {
  const [filterValue, setFilterValue] = React.useState<string>("");
  const [selectedKeys, setSelectedKeys] = React.useState<Set<string>>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<Set<string>>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = React.useState<string | "all">("all");
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<{ column: string; direction: string }>({
    column: "model",
    direction: "ascending",
  });
  const [page, setPage] = React.useState<number>(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns.has("all")) return columns;

    return columns.filter((column) => visibleColumns.has(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredModels = [...models];

    if (hasSearchFilter) {
      filteredModels = filteredModels.filter((model) =>
        model.model.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    return filteredModels;
  }, [filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((model, columnKey) => {
    const cellValue = model[columnKey];

    switch (columnKey) {
      case "model":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
          </div>
        );
      case "vehicleType":
        return <p className="capitalize">{cellValue}</p>;
      case "launchPrice":
        return <p>{`$${cellValue}`}</p>;
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem>View</DropdownItem>
                <DropdownItem>Edit</DropdownItem>
                <DropdownItem>Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by model..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button color="primary" endContent={<PlusIcon />}>
              Add New
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
  }, [filterValue, visibleColumns, onRowsPerPageChange, models.length, onSearchChange]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys.size} of {filteredItems.length} selected
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
            Previous
          </Button>
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, page, pages]);

  return (
    <Table
      aria-label="Table with custom cells, pagination and sorting"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[382px]",
      }}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={sortedItems}>
        {(item) => (
          <TableRow key={item.key}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

const columns = [
  { name: "Model", uid: "model", sortable: true },
  { name: "Vehicle Type", uid: "vehicleType", sortable: true },
  { name: "Launch Price", uid: "launchPrice", sortable: true },
  { name: "Actions", uid: "actions" },
];















// import * as React from 'react';
// import Accordion from '@mui/material/Accordion';
// import AccordionSummary from '@mui/material/AccordionSummary';
// import AccordionDetails from '@mui/material/AccordionDetails';
// import Typography from '@mui/material/Typography';
// import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
// import { useEffect, useState } from 'react';

// interface ModelDetails {
//   id: number;
//   vehicleType: string;
//   model: string;
//   seatingCapacity: string;
//   engineType: string;
//   colorsAvailable: string[];
//   torque: string;
//   variants: string[];
//   img: string[];
// }

// interface CarBrand {
//   name: string;
//   models: ModelDetails[];
// }

// export default function AccordionExpandIcon() {
  
//   const [brandsData, setBrandsData] = useState<CarBrand[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch the brands and models from the FastAPI backend
//   useEffect(() => {
//     const fetchBrandsModels = async () => {
//       try {
//         const response = await fetch('http://localhost:8000/get-brands-models'); // Adjust the URL based on your FastAPI server
//         const data = await response.json();
//         setBrandsData(data);
//         setLoading(false);

//         console.log(brandsData)

//       } catch (error) {
//         console.error('Error fetching brands and models:', error);
//         setLoading(false);
//       }
//     };

//     fetchBrandsModels();
//   }, []);

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div className='w-11/12 mx-auto'>
//       {brandsData.map((brand, brandIndex) => (
//         <Accordion key={brandIndex}>
//           <AccordionSummary
//             expandIcon={<ArrowDownwardIcon />}
//             aria-controls={`panel${brandIndex + 1}-content`}
//             id={`panel${brandIndex + 1}-header`}
//           >
//             <Typography>{`${brand.name} (${brand.models.length} Models)`}</Typography>
//           </AccordionSummary>
//           <AccordionDetails>
//             <table className="min-w-full border-collapse table-auto">
//               <thead>
//                 <tr>
//                   <th className="border px-4 py-2">S.No</th>
//                   <th className="border px-4 py-2">Vehicle Type</th>
//                   <th className="border px-4 py-2">Model Name</th>
//                   <th className="border px-4 py-2">Seating Capacity</th>
//                   <th className="border px-4 py-2">Engine Type</th>
//                   <th className="border px-4 py-2">Colors Available</th>
//                   <th className="border px-4 py-2">Torque</th>
//                   <th className="border px-4 py-2">Variants</th>
//                   <th className="border px-4 py-2">Images</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {brand.models.map((model, modelIndex) => (
//                   <tr key={model.id}>
//                     <td className="border px-4 py-2">{modelIndex + 1}</td>
//                     <td className="border px-4 py-2">{model.vehicleType}</td>
//                     <td className="border px-4 py-2">{model.model}</td>
//                     <td className="border px-4 py-2">{model.seatingCapacity}</td>
//                     <td className="border px-4 py-2">{model.engineType}</td>
//                     <td className="border px-4 py-2">
//                       {model.colorsAvailable.join(', ')}
//                     </td>
//                     <td className="border px-4 py-2">{model.torque}</td>
//                     <td className="border px-4 py-2">
//                       {model.variants.join(', ')}
//                     </td>
//                     <td className="border px-4 py-2">
//                       {model.img.map((image, imgIndex) => (
//                         <img
//                           key={imgIndex}
//                           src={image}
//                           alt={`${model.model}-${imgIndex}`}
//                           className="w-12 h-12 object-cover mr-2"
//                         />
//                       ))}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </AccordionDetails>
//         </Accordion>
//       ))}
//     </div>
//   );
// }

















// import * as React from 'react';
// import Accordion from '@mui/material/Accordion';
// import AccordionSummary from '@mui/material/AccordionSummary';
// import AccordionDetails from '@mui/material/AccordionDetails';
// import Typography from '@mui/material/Typography';
// import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

// export default function AccordionExpandIcon() {
//   return (
//     <div className='w-11/12 mx-auto'>
//       <Accordion>
        
//         <AccordionSummary expandIcon={<ArrowDownwardIcon />} aria-controls="panel1-content" id="panel1-header" >
//           <Typography>Brand Name + No of Models in each brand</Typography>
//         </AccordionSummary>
        
//         <AccordionDetails>
//           Models Details To be modified later on..
//         </AccordionDetails>
      
//       </Accordion>
//     </div>
//   );
// }
