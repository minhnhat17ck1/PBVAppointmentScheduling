import React, { useEffect , useId} from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import Button from '@mui/material/Button';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import SendIcon from '@mui/icons-material/Send';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import emailjs from '@emailjs/browser';
import LogoutButton from './LogoutButton';
import { useAuth0 } from "@auth0/auth0-react";

const Booking = () => {

  useEffect(() => emailjs.init("2FRhM7NAE0ZFgGQiD"), []);

  const Alert = React.forwardRef((props, ref) => (
    <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
  ));
  const { user } = useAuth0();
  const userEmail = user.email;
  const [successAlert, setSuccessAlert] = React.useState(false);
  const [errorAlert1, setErrorAlert1] = React.useState(false);
  const [errorAlert2, setErrorAlert2] = React.useState(false);
  const [errorAlert3, setErrorAlert3] = React.useState(false);
  const [errorAlert4, setErrorAlert4] = React.useState(false);
  const [firstName, setfirstName] = React.useState('');
  const [lastName, setlastName] = React.useState('');
  const [userPhone, setuserPhone] = React.useState('');
  const [serviceType, setServiceType] = React.useState('');
  const today = dayjs();
  const id = useId();
  const yesterday = today.subtract(1, 'day');
  const limitAnHour = today.add(1, 'hour');
  const [selectedDateTime, setSelectedDateTime] = React.useState(null);
  const [bookingDateTime, setBookingDateTime] = React.useState(null);

  // Set initial state for form validation
  const [firstNameError, setFirstNameError] = React.useState('');
  const [lastNameError, setLastNameError] = React.useState('');
  const [userPhoneError, setUserPhoneError] = React.useState('');
  const [userEmailError, setUserEmailError] = React.useState('');
  const [serviceTypeError, setServiceTypeError] = React.useState('');

  const handlefirstNameChange = (event) => {
    setfirstName(event.target.value);
    validateFirstName();
  };

  const handlelastNameChange = (event) => {
    setlastName(event.target.value);
    validateLastName();
  };

  const handleuserPhoneChange = (event) => {
    setuserPhone(event.target.value);
    validateUserPhone();
  };

  // Uncomment if you want customer able to change email
  // const handleuserEmailChange = (event) => {
  //   setuserEmail(event.target.value);
  //   validateUserEmail();
  // };

  const handleserviceTypeChange = (event) => {
    setServiceType(event.target.value);
    validateServiceType();
  };

  // Validate form fields on change
  const validateFirstName = () => {
    if (!firstName) {
      setFirstNameError('First name is required!');
      return false;
    }
    setFirstNameError('');
    return true;
  };
  const validateLastName = () => {
    if (!lastName) {
      setLastNameError('Last name is required!');
      return false;
    }
    setLastNameError('');
    return true;
  };
  const validateUserPhone = () => {
    if (!userPhone) {
      setUserPhoneError('Phone number is required!');
      return false;
    }
    setUserPhoneError('');
    return true;
  };
  const validateUserEmail = () => {
    if (!userEmail) {
      setUserEmailError('Email is required!');
      return false;
    }
    setUserEmailError('');
    return true;
  };
  const validateServiceType = () => {
    if (!serviceType) {
      setServiceTypeError('Service type is required!');
      return false;
    }
    setServiceTypeError('');
    return true;
  };

  const handleBookAppointment = async (e) => {
      e.preventDefault();
      
      const isFirstNameValid = validateFirstName();
      const isLastNameValid = validateLastName();
      const isUserPhoneValid = validateUserPhone();
      const isUserEmailValid = validateUserEmail();
      const isServiceTypeValid = validateServiceType();
      const formattedDateTime = selectedDateTime.format('MM/DD/YYYY [at] HH:mm');
      const serviceId = "service_n43gtkq";
      const templateId = "template_zf7c082";
      const getAppointment = 'https://appointment-server-production.up.railway.app/Appointment';
      // const getAppointment = 'http://localhost:8080/Appointment';
      
  
      
        clearAlerts();
        if (selectedDateTime && selectedDateTime < limitAnHour) {
          setErrorAlert1(true);
        } else if (selectedDateTime && isFirstNameValid && isLastNameValid && isUserPhoneValid && isUserEmailValid && isServiceTypeValid) {
          setBookingDateTime(selectedDateTime);
          try {
            const formData = {
              id,
              firstName,
              lastName,
              userPhone,
              userEmail,
              serviceType,
              selectedDateTime,
            };
            // Send appointment information to MongoDB
            const responseCreated = await axios.post( getAppointment, formData);

            console.log('Appointment database sent:', responseCreated.data);
            setSuccessAlert(true);
            // Send a confirmation email to client
            await emailjs.send(serviceId, templateId, {
              id,
              firstName,
              lastName,
              userEmail,
              serviceType,
              selectedDateTime: formattedDateTime,
             });
          } catch (error) {
            console.error('Error sending appointment database:', error);
            setErrorAlert4(true);
          }
        } else if (!selectedDateTime) {
          setErrorAlert2(true);
        } else {
          setErrorAlert3(true);
        }
  };

  const clearAlerts = () => {
    setSuccessAlert(false);
    setErrorAlert1(false);
    setErrorAlert2(false);
    setErrorAlert3(false);
    setErrorAlert4(false);
  };

  const handleCloseSnackbar = () => {
    setSuccessAlert(false);
    setErrorAlert1(false);
    setErrorAlert2(false);
    setErrorAlert3(false);
    setErrorAlert4(false);
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={10} md={12} lg={12}>
          <Stack sx={{ width: '100%' }} spacing={2}>
            <TextField
              required
              id="demo-helper-text-misaligned-no-helper"
              label="First Name:"
              type="text"
              value={firstName}
              onChange={handlefirstNameChange}
              error={!!firstNameError}
              helperText={firstNameError}
            />
            <TextField
              required
              id="demo-helper-text-misaligned-no-helper"
              label="Last Name:"
              type="text"
              value={lastName}
              onChange={handlelastNameChange}
              error={!!lastNameError}
              helperText={lastNameError}
            />
            <TextField
              required
              id="demo-helper-text-misaligned-no-helper"
              label="Phone Number:"
              type="tel"
              value={userPhone}
              onChange={handleuserPhoneChange}
              error={!!userPhoneError}
              helperText={userPhoneError}
            />
            <TextField
              required
              id="demo-helper-text-misaligned-no-helper"
              label="Your Email:"
              type="text"
              value={userEmail}
              // Uncomment if you want user able to change email
              // onChange={handleuserEmailChange} 
              error={!!userEmailError}
              helperText={userEmailError}
            />
            <FormControl>
              <FormLabel 
              required
              error={!!serviceTypeError}
              helperText={serviceTypeError}>
              Services
              </FormLabel>
              <RadioGroup
                value={serviceType}
                onChange={handleserviceTypeChange}
                name="radio-buttons-group"
                helperText={serviceTypeError}
              >
                <FormControlLabel
                  value="classic"
                  onChange={handleserviceTypeChange}
                  control={<Radio />}
                  label="Classic Eyelash"
                />
                <FormControlLabel
                  value="hybrid"
                  onChange={handleserviceTypeChange}
                  control={<Radio />}
                  label="Hybrid Eyelash"
                />
                <FormControlLabel
                  value="volume"
                  onChange={handleserviceTypeChange}
                  control={<Radio />}
                  label="Volume Eyelash"
                />
              </RadioGroup>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                openTo="day"
                defaultValue={yesterday}
                value={selectedDateTime}
                onChange={(newValue) => setSelectedDateTime(newValue)}
                ampm={false} // Disable AM/PM indicator
                minTime={selectedDateTime?.set('hour', 9)}
                maxTime={selectedDateTime?.set('hour', 19)}
                disablePast
              />
            </LocalizationProvider>
            <Button
              onClick={handleBookAppointment}
              variant="contained"
              endIcon={<SendIcon />}
            >
              Send
            </Button>
            <LogoutButton />
          </Stack>
        </Grid>
      </Grid>
      <Snackbar
        open={successAlert || errorAlert1 || errorAlert2 || errorAlert2}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Stack sx={{ width: '100%' }} spacing={2}>
          {successAlert && (
            <Alert severity="success" onClose={() => setSuccessAlert(false)}>
              <AlertTitle>
                <strong>Success!</strong>
              </AlertTitle>
              Appointment created for: {firstName} {lastName} at {' '}
              {bookingDateTime?.format('MM/DD/YYYY - HH:MM')}
            </Alert>
          )}
          {errorAlert1 && (
            <Alert severity="error" onClose={() => setErrorAlert1(false)}>
              <AlertTitle>Error!</AlertTitle>
              Please set aside at least one hour starting from this moment!
            </Alert>
          )}
          {errorAlert2 && (
            <Alert severity="error" onClose={() => setErrorAlert2(false)}>
              <AlertTitle>Error!</AlertTitle>
              Please select date and time for appointment!
            </Alert>
          )}
          {errorAlert3 && (
            <Alert severity="error" onClose={() => setErrorAlert3(false)}>
              <AlertTitle>Error!</AlertTitle>
              Form validation failed. Please check the fields!
            </Alert>
          )}
          {errorAlert4 && (
            <Alert severity="error" onClose={() => setErrorAlert4(false)}>
              <AlertTitle>Error!</AlertTitle>
              Unexpected Error! Please try again in few more minutes!
            </Alert>
          )}
        </Stack>
      </Snackbar>
    </div>
  );
  
};

export default Booking
