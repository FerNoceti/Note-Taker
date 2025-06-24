import React from "react";
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Chip,
  Stack,
} from "@mui/material";
import { NoteAdd, PersonAdd, Login, Email } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h2" component="h1" gutterBottom color="primary">
          Notes App Challenge
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Note-taking application with tags and filtering
        </Typography>
      </Box>

      <Box textAlign="center" mb={4}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
        >
          {isAuthenticated && (
            <Button
              variant="contained"
              size="large"
              startIcon={<NoteAdd />}
              sx={{ minWidth: 200 }}
              onClick={() => navigate("/notes")}
            >
              Go to My Notes
            </Button>
          )}
          {!isAuthenticated && (
            <>
              <Button
                variant="outlined"
                size="large"
                startIcon={<PersonAdd />}
                sx={{ minWidth: 200 }}
                onClick={() => navigate("/register")}
              >
                Create Account
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<Login />}
                sx={{ minWidth: 200 }}
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
            </>
          )}
        </Stack>
      </Box>

      <Paper elevation={2} sx={{ p: 3, mb: 4, bgcolor: "primary.50" }}>
        <Typography variant="h6" gutterBottom>
          Welcome to the Challenge!
        </Typography>
        <Typography variant="body1" paragraph>
          This application allows you to create, edit and organize your notes
          efficiently. You can add tags to your notes to categorize and filter
          them easily.
        </Typography>
        {!isAuthenticated && (
          <Typography variant="body2" color="text.secondary">
            You are invited to create an account and try all the application
            features, or sign in if you already have an account.
          </Typography>
        )}
      </Paper>

      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Tech Stack
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} mb={2}>
          <Chip label="React" color="primary" />
          <Chip label="Flask" color="secondary" />
          <Chip label="PostgreSQL" color="success" />
          <Chip label="Docker" color="info" />
          <Chip label="Material-UI" variant="outlined" />
          <Chip label="JWT Authentication" variant="outlined" />
        </Stack>
        <Typography variant="body2" color="text.secondary">
          Fully dockerized application with React frontend, Flask backend and
          PostgreSQL database.
        </Typography>
      </Paper>

      <Box textAlign="center">
        <Typography variant="h6" gutterBottom>
          Developed by
        </Typography>
        <Typography variant="h5" color="primary" gutterBottom>
          Fernando José Noceti
        </Typography>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={1}
          mb={2}
        >
          <Email fontSize="small" />
          <Typography
            component="a"
            href="mailto:fer.j.noceti@gmail.com"
            sx={{
              color: "primary.main",
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            fer.j.noceti@gmail.com
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Full Stack Implementation Exercise - Notes App
        </Typography>
      </Box>
    </Container>
  );
};

export default HomePage;
