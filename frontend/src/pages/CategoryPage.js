import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Box,
  CircularProgress,
  Paper,
  useTheme,
  useMediaQuery,
  Chip,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";
import CategoryService from "../services/categoryService";
import NoteService from "../services/noteService";

const CategoryPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [categories, setCategories] = useState([]);
  const [notes, setNotes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesData, notesData] = await Promise.all([
        CategoryService.getCategories(),
        NoteService.getNotes(),
      ]);
      setCategories(categoriesData);
      setNotes(notesData);
      setError("");
    } catch (err) {
      setError(err.error || "Failed to load data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getNoteCount = (categoryId) => {
    return notes.filter((note) =>
      note.categories?.some((cat) => cat.id === categoryId)
    ).length;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenDialog = (category = null) => {
    setCurrentCategory(category);
    if (category) {
      setFormData({ name: category.name });
    } else {
      setFormData({ name: "" });
    }
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    try {
      if (currentCategory) {
        await CategoryService.updateCategory(currentCategory.id, {
          name: formData.name,
        });
        setSuccess("Category updated successfully!");
      } else {
        await CategoryService.createCategory(formData.name);
        setSuccess("Category created successfully!");
      }
      fetchData();
      handleCloseDialog();
    } catch (err) {
      setError(err.error || "Operation failed");
      console.error("Category operation error:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await CategoryService.deleteCategory(id);
      setSuccess("Category deleted successfully!");
      fetchData();
    } catch (err) {
      setError(err.error || "Failed to delete category");
      console.error("Delete error:", err);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentCategory(null);
    setFormData({ name: "" });
  };

  const handleCloseAlert = () => {
    setError("");
    setSuccess("");
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              color: theme.palette.primary.main,
              mb: isMobile ? 2 : 0,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <CategoryIcon fontSize="large" />
            My Categories
          </Typography>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3,
              boxShadow: "none",
              whiteSpace: "nowrap",
            }}
          >
            New Category
          </Button>
        </Box>
      </Paper>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="300px"
        >
          <CircularProgress size={60} thickness={4} />
        </Box>
      ) : categories.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            textAlign: "center",
            p: 6,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Box sx={{ maxWidth: 400, mx: "auto" }}>
            <CategoryIcon
              sx={{ fontSize: 60, color: theme.palette.grey[400], mb: 2 }}
            />
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              No categories yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create your first category to organize your notes
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
            >
              Create Category
            </Button>
          </Box>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: theme.shadows[6],
                  },
                  borderRadius: 2,
                  overflow: "hidden",
                  borderTop: `4px solid ${theme.palette.primary.main}`,
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        flexGrow: 1,
                      }}
                    >
                      {category.name}
                    </Typography>
                    <Chip
                      label={`${getNoteCount(category.id)} notes`}
                      size="small"
                      sx={{
                        backgroundColor: theme.palette.primary.light,
                        color: theme.palette.primary.contrastText,
                      }}
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography
                    variant="caption"
                    display="block"
                    sx={{
                      color: theme.palette.text.disabled,
                      fontStyle: "italic",
                    }}
                  >
                    Created:{" "}
                    {new Date(category.created_at).toLocaleDateString()}
                    <br />
                    Updated:{" "}
                    {new Date(category.updated_at).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions
                  sx={{
                    justifyContent: "flex-end",
                    bgcolor: theme.palette.grey[100],
                    px: 2,
                    py: 1,
                  }}
                >
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleOpenDialog(category)}
                    sx={{
                      "&:hover": {
                        backgroundColor: theme.palette.primary.light,
                      },
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(category.id)}
                    sx={{
                      "&:hover": {
                        backgroundColor: theme.palette.error.light,
                      },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create/Edit Category Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 600,
            bgcolor: theme.palette.primary.main,
            color: theme.palette.common.white,
            borderRadius: "12px 12px 0 0",
          }}
        >
          {currentCategory ? "Edit Category" : "Create New Category"}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              autoFocus
              margin="normal"
              name="name"
              label="Category Name"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.name}
              onChange={handleInputChange}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={handleCloseDialog}
            color="secondary"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={!formData.name.trim()}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3,
              boxShadow: "none",
            }}
          >
            {currentCategory ? "Update Category" : "Create Category"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbars */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="error"
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: theme.shadows[6],
          }}
        >
          {error}
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="success"
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: theme.shadows[6],
          }}
        >
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CategoryPage;
