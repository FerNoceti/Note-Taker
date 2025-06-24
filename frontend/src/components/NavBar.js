import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Home } from "@mui/icons-material";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import CategoryIcon from "@mui/icons-material/Category";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

function NavBar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useUser();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 0,
            mr: 4,
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          Challenge App
        </Typography>

        <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
          <Button
            color="inherit"
            startIcon={<Home />}
            onClick={() => navigate("/")}
            sx={{ mr: 2 }}
          >
            Home
          </Button>
          {isAuthenticated && (
            <>
              <Button
                color="inherit"
                startIcon={<NoteAltIcon />}
                onClick={() => navigate("/notes")}
                sx={{ mr: 2 }}
              >
                Notes
              </Button>
              <Button
                color="inherit"
                startIcon={<CategoryIcon />}
                onClick={() => navigate("/categories")}
                sx={{ mr: 2 }}
              >
                Categories
              </Button>
            </>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {isAuthenticated ? (
            <>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                onClick={() => navigate("/login")}
                sx={{ mr: 1 }}
              >
                Login
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => navigate("/register")}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
