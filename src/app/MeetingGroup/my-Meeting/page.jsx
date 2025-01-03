"use client"
import React, { useState } from 'react';
import Favorite from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';

const LikeButton = () => {
    const [liked, setLiked] = useState(false);

    const handleLike = () => {
        setLiked(!liked);
    };

    return (
        <IconButton onClick={handleLike} >
            {/* <Favorite color={liked ? 'error' : 'action'} /> */}
            <Favorite sx={{color: liked ? 'red' : 'gray'}} />
        </IconButton>
    );
};

export default LikeButton;
