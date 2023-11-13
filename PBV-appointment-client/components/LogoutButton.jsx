import React from 'react'
import { Grid, Avatar, Button, Stack } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
    const { logout } = useAuth0();

    const avatarStyle = { backgroundColor: '#1bbd7e' };
    const btnstyle = { margin: '8px 0' };

    return (
        <Button
            onClick={() => logout({ returnTo: window.location.origin })} // Wrap the logout call in an arrow function
            type='button'
            color='error'
            variant="outlined"
            style={btnstyle}
            fullWidth
        >
            Logout?
        </Button>
    );
}

export default LogoutButton;
