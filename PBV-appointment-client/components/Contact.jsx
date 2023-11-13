import React, {useEffect} from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import SendIcon from '@mui/icons-material/Send';
import AlertTitle from '@mui/material/AlertTitle';
import { Box, Stack } from '@mui/material';
import TextField from '@mui/material/TextField';
import emailjs from '@emailjs/browser';
import { useAuth0 } from "@auth0/auth0-react";


const Contact = () => {

  useEffect(() => emailjs.init("2FRhM7NAE0ZFgGQiD"), []);

  const { user } = useAuth0();
  const Alert = React.forwardRef((props, ref) => (
    <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
  ));

  const [successAlert, setSuccessAlert] = React.useState(false);
  const [errorAlert1, setErrorAlert1] = React.useState(false);
  const [firstName, setfirstName] = React.useState('');
  const [lastName, setlastName] = React.useState('');
  const [userEmail, setuserEmail] = React.useState(`${user.email}`);
  const [message, setMessage] = React.useState('');



  // Set initial state for form validation
  const [firstNameError, setFirstNameError] = React.useState('');
  const [lastNameError, setLastNameError] = React.useState('');
  const [userEmailError, setUserEmailError] = React.useState('');
  const [messageError, setMessageError] = React.useState('');

  const handlefirstNameChange = (event) => {
    setfirstName(event.target.value);
    validateFirstName();
  };

  const handlelastNameChange = (event) => {
    setlastName(event.target.value);
    validateLastName();
  };

  // const handleuserEmailChange = (event) => {
  //   setuserEmail(event.target.value);
  //   validateUserEmail();
  // };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
    validateMessage();
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

  const validateUserEmail = () => {
    if (!userEmail) {
      setUserEmailError('Email is required!');
      return false;
    }
    setUserEmailError('');
    return true;
  };
  const validateMessage = () => {
    if (!message) {
      setMessageError('Message is required!');
      return false;
    }
    setMessageError('');
    return true;
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      const isFirstNameValid = validateFirstName();
      const isLastNameValid = validateLastName();
      const isUserEmailValid = validateUserEmail();
      const isMessageValid = validateMessage();
      const serviceId = "service_n43gtkq";
      const templateId = "template_q0mhjdp";

      if (isFirstNameValid && isLastNameValid &&  isUserEmailValid && isMessageValid) {
        try {
          await emailjs.send(serviceId, templateId, {
           firstName,
           lastName,
           userEmail,
           message
          });
          console.log("Email successfully sent!");
          setSuccessAlert(true);
        } catch (error) {
          console.log(error);
          setErrorAlert1(true);
        }
      };
    };

  const handleCloseSnackbar = () => {
    setSuccessAlert(false);
    setErrorAlert1(false);
  };

  return (
    <div>
      <Box sx={{ width: '100%' }}>
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
              label="Your Email:"
              type="text"
              value={userEmail}
              // onChange={handleuserEmailChange}
              error={!!userEmailError}
              helperText={userEmailError}
            />

            <TextField
              required
              id="outlined-multiline-static"
              label="Message:"
              multiline
              rows={4}
              value={message}
              onChange={handleMessageChange}
              error={!!messageError}
              helperText={messageError}
            />

            <Button
              onClick={handleSubmit}
              variant="contained"
              endIcon={<SendIcon />}
            >
              Send
            </Button>
          </Stack>
        </Grid>
      </Grid>
      <Snackbar
        open={successAlert || errorAlert1 }
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Stack sx={{ width: '100%' }} spacing={2}>
          {successAlert && (
            <Alert severity="success" onClose={() => setSuccessAlert(false)}>
              <AlertTitle>
                <strong>Thank you for your submission!</strong>
              </AlertTitle>
              We have received your message and will be in touch with you shortly.
            </Alert>
          )}
          {errorAlert1 && (
            <Alert severity="error" onClose={() => setErrorAlert1(false)}>
              <AlertTitle>Error!</AlertTitle>
              Form validation failed. Please check the fields!
            </Alert>
          )}
        </Stack>
      </Snackbar>
      </Box>
    </div>
  );
  
};

export default Contact
