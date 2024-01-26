"use client";
import IconButton from "@mui/material/IconButton";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

export default function AudioButton({ audioUrl }: { audioUrl: string }) {
    const playAudio = () => {
        const audio = new Audio(`/audio/${audioUrl}`);
        audio.play();
    };

    return (
        <IconButton onClick={playAudio}>
            <VolumeUpIcon />
        </IconButton>
    );
}
