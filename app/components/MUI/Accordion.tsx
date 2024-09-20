import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

function createData(name: string, calories: number, fat: number) {
  return { name, calories, fat };
}

const rows = [
  createData('Cupcake', 305, 3.7),
  createData('Donut', 452, 25.0),
  createData('Eclair', 262, 16.0),
  createData('Frozen yoghurt', 159, 6.0),
  createData('Gingerbread', 356, 16.0),
  createData('Honeycomb', 408, 3.2),
  createData('Ice cream sandwich', 237, 9.0),
  createData('Jelly Bean', 375, 0.0),
  createData('KitKat', 518, 26.0),
  createData('Lollipop', 392, 0.2),
  createData('Marshmallow', 318, 0),
  createData('Nougat', 360, 19.0),
  createData('Oreo', 437, 18.0),
].sort((a, b) => (a.calories < b.calories ? -1 : 1));

export default function CustomPaginationActionsTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {row.calories}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {row.fat}
              </TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              slotProps={{
                select: {
                  inputProps: {
                    'aria-label': 'rows per page',
                  },
                  native: true,
                },
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}













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
//   launchPrice:string;
//   horsepower:string;
//   startingPrice:string;
  
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
//                   <th className="border px-4 py-2">Starting Price</th>
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
//                       { model.colorsAvailable.join(', ') }
//                     </td>
//                     <td className="border px-4 py-2">{model.torque}</td>
//                     <td className="border px-4 py-2">{model.startingPrice}</td>
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
