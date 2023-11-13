import React from 'react'
import { Grid, Avatar, TextField, Button, Typography, Link, Stack } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const LoginButton=()=>{
    const { loginWithRedirect, isAuthenticated } = useAuth0();
    const navigate = useNavigate();

    const avatarStyle={backgroundColor:'#1bbd7e'}
    const btnstyle={margin:'8px 0'}

    const handleLoginAndRedirect = () => {
        loginWithRedirect();
      };
    
      // Use `isAuthenticated` to determine if the user is logged in
      if (isAuthenticated) {
        // If the user is already authenticated, navigate to /home
        navigate('/home');
        return null; // Render nothing since we're redirecting
      }
    
    return(
        <Grid container spacing={2}>
            <Stack>
                <Grid align='center'>
                    <Avatar style={avatarStyle}><LockOutlinedIcon/></Avatar>
                    <h2>Welcome to the Appointment Scheduling App!</h2>
                </Grid>
                <Grid align='center'>
                    <Button onClick={handleLoginAndRedirect} type='submit' color='primary' variant="contained" style={btnstyle} fullWidth>Sign in</Button>
                </Grid>
            </Stack>
            
                
        </Grid>
    )
}

export default LoginButton;