import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";

export default function DataTable() {

  const { user, isAuthenticated } = useAuth0();
  const userAccount = user.email;
  const [selected, setSelected] = React.useState([]);
  const [myappointments, setMyAppointments] = React.useState([]);
  const [successAlert, setSuccessAlert] = React.useState(false);
  const Alert = React.forwardRef((props, ref) => (
    <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
  ));

  const columns = [
    {
      field: 'selectedDateTime',
      headerName: 'Date Time',
      width: 160,
      sortable: false,
      valueGetter: (params) => {
        const date = new Date(params.row.selectedDateTime);
        return date.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }); // Adjust this based on your formatting requirements
      },
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      sortable: false,
      width: 160,
      valueGetter: (params) =>
        `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
    {
      field: 'serviceType',
      headerName: 'Service Type',
      width: 130,
      sortable: false,
      valueGetter: (params) => `${params.row.serviceType}`,
    },

    {
      field: '_id', // Define an 'id' field to uniquely identify rows.
      headerName: 'ID',
    },
  ];

  const fetchData = async () => {
    try {
      const getAppointmentByUser = `http://localhost:8080/Modify/${userAccount}`;
      const response = await axios.get(getAppointmentByUser);
      // Add a unique identifier 'id' to each row
      const appointmentsWithId = response.data.map((appointment, _id) => ({
        ...appointment,
        id: _id,
      }));
      setMyAppointments(appointmentsWithId);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteRow = (dbID) => {
    console.log('Handling delete for ID:', dbID);
    const deleteAppointmentByUser = `http://localhost:8080/Modify/${userAccount}/${dbID}`;
    // Send a DELETE request to the server
    axios.delete(deleteAppointmentByUser) 
      .then(() => {
        // On success, re-fetch the data to update the list
        fetchData();
        setSelected([]);
        setSuccessAlert(true);

      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCloseSnackbar = () => {
    setSuccessAlert(false);
  }
  
  return (
    isAuthenticated && (
    <div>
    <Box sx={{ width: '100%' }}>
      <b>Account:</b> {user.email}
      <Box sx={{ height: 400, mt: 1, mb:1 }}>
        <DataGrid
          disableColumnMenu
          aria-label="Appointment"
          rows={myappointments}
          columns={columns}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          // onSelectionModelChange is now onRowSelectionModelChange
          // in MUI DataGrid (using "@mui/x-data-grid": "^6.2.1")
          onRowSelectionModelChange={(newSelection) => {
            // it returns the row ID, not row's db ID
            // see `handleDeleteRow` to filter and extract the selected rows' data
            setSelected(newSelection);
          }}
          initialState={{
            sorting: {
              sortModel: [{ field: 'selectedDateTime', sort: 'desc' }],
            },
          }}
        />
      </Box>
      <Stack direction="row" spacing={2}>
        <Snackbar
        open={successAlert}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Stack sx={{ width: '100%' }} spacing={2}>
          {successAlert && (
            <Alert severity="success" onClose={() => setSuccessAlert(false)}>
              <AlertTitle>
                Cancelation Successful!
              </AlertTitle>
            </Alert>
          )}
          </Stack>
      </Snackbar>
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={() => {
            // Filter and extract the selected rows' data
            const selectedRows = myappointments.filter((row) => selected.includes(row.id));
             // Now, you can access the data of the selected rows (e.g., selectedRows[0].selectedDateTime, selectedRows[0].fullName, etc.)
            if (selectedRows.length === 0) {
              return;
            }
            try {
              for (const selectedItem of selectedRows) {
                handleDeleteRow(selectedItem._id);
              }
            } catch (error) {
              console.log(error);
            }
          }}
        >
          Cancel Appointment
        </Button>
      </Stack>
    </Box>
    </div>
  )
  );
}
