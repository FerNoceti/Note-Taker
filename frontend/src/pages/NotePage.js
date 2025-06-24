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
  Tabs,
  Tab,
  Box,
  CircularProgress,
  Paper,
  useTheme,
  useMediaQuery,
  Chip,
  Autocomplete,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Archive as ArchiveIcon,
  Unarchive as UnarchiveIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import NoteService from "../services/noteService";
import CategoryService from "../services/categoryService";

const NotePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [notes, setNotes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      let notesData;

      switch (tabValue) {
        case 0:
          notesData = await NoteService.getNotes();
          break;
        case 1:
          notesData = await NoteService.getActiveNotes();
          break;
        case 2:
          notesData = await NoteService.getArchivedNotes();
          break;
        default:
          notesData = await NoteService.getNotes();
      }

      setNotes(notesData);
      setError("");
    } catch (err) {
      setError(err.error || "Failed to load notes");
      console.error("Error fetching notes:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const categories = await CategoryService.getCategories();
      setAllCategories(categories);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(err.error || "Failed to load categories");
    }
  };

  useEffect(() => {
    fetchNotes();
    fetchCategories();
  }, [tabValue]);

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.categories?.some((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenDialog = (note = null) => {
    setCurrentNote(note);
    if (note) {
      setFormData({ title: note.title, content: note.content || "" });
      setSelectedCategories(note.categories || []);
    } else {
      setFormData({ title: "", content: "" });
      setSelectedCategories([]);
    }
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    try {
      const category_ids = selectedCategories.map((cat) => cat.id);

      if (currentNote) {
        await NoteService.updateNote(currentNote.id, {
          title: formData.title,
          content: formData.content,
          category_ids,
        });
        setSuccess("Note updated successfully!");
      } else {
        await NoteService.createNote(
          formData.title,
          formData.content,
          category_ids
        );
        setSuccess("Note created successfully!");
      }
      fetchNotes();
      handleCloseDialog();
    } catch (err) {
      setError(err.error || "Operation failed");
      console.error("Note operation error:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await NoteService.deleteNote(id);
      setSuccess("Note deleted successfully!");
      fetchNotes();
    } catch (err) {
      setError(err.error || "Failed to delete note");
      console.error("Delete error:", err);
    }
  };

  const handleArchive = async (id, shouldArchive) => {
    try {
      if (shouldArchive) {
        await NoteService.archiveNote(id);
        setSuccess("Note archived!");
      } else {
        await NoteService.unarchiveNote(id);
        setSuccess("Note unarchived!");
      }
      fetchNotes();
    } catch (err) {
      setError(err.error || "Archive operation failed");
      console.error("Archive error:", err);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentNote(null);
    setFormData({ title: "", content: "" });
    setSelectedCategories([]);
  };

  const handleCloseAlert = () => {
    setError("");
    setSuccess("");
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
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
            }}
          >
            My Notes
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              width: isMobile ? "100%" : "auto",
            }}
          >
            <TextField
              size="small"
              placeholder="Search notes..."
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
              }}
              sx={{
                width: isMobile ? "100%" : 300,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
              New Note
            </Button>
          </Box>
        </Box>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            mb: 3,
            "& .MuiTabs-indicator": {
              height: 4,
              borderRadius: 2,
            },
          }}
        >
          <Tab
            label="All Notes"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          />
          <Tab
            label="Active"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          />
          <Tab
            label="Archived"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          />
        </Tabs>
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
      ) : filteredNotes.length === 0 ? (
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
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              {searchTerm
                ? "No matching notes found"
                : tabValue === 2
                ? "No archived notes"
                : "Your notes will appear here"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchTerm
                ? "Try a different search term"
                : tabValue === 2
                ? "Archive notes to see them here"
                : "Create your first note by clicking the 'New Note' button"}
            </Typography>
            {!searchTerm && tabValue !== 2 && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
              >
                Create Note
              </Button>
            )}
          </Box>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredNotes.map((note) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={note.id}>
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
                  borderLeft: `4px solid ${
                    note.archived
                      ? theme.palette.warning.main
                      : theme.palette.success.main
                  }`,
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {note.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      minHeight: 60,
                    }}
                  >
                    {note.content || "No content"}
                  </Typography>

                  {/* Category Chips */}
                  {note.categories && note.categories.length > 0 && (
                    <Box
                      sx={{
                        mt: 1,
                        mb: 1,
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.5,
                      }}
                    >
                      {note.categories.map((category) => (
                        <Chip
                          key={category.id}
                          label={category.name}
                          size="small"
                          sx={{
                            backgroundColor: theme.palette.primary.light,
                            color: theme.palette.primary.contrastText,
                            fontSize: "0.7rem",
                            fontWeight: 500,
                          }}
                        />
                      ))}
                    </Box>
                  )}

                  <Typography
                    variant="caption"
                    display="block"
                    sx={{
                      color: theme.palette.text.disabled,
                      fontStyle: "italic",
                    }}
                  >
                    Created: {new Date(note.created_at).toLocaleDateString()}
                    <br />
                    Updated: {new Date(note.updated_at).toLocaleDateString()}
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
                    onClick={() => handleOpenDialog(note)}
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
                    onClick={() => handleDelete(note.id)}
                    sx={{
                      "&:hover": {
                        backgroundColor: theme.palette.error.light,
                      },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color={note.archived ? "success" : "warning"}
                    onClick={() => handleArchive(note.id, !note.archived)}
                    sx={{
                      "&:hover": {
                        backgroundColor: note.archived
                          ? theme.palette.success.light
                          : theme.palette.warning.light,
                      },
                    }}
                  >
                    {note.archived ? (
                      <UnarchiveIcon fontSize="small" />
                    ) : (
                      <ArchiveIcon fontSize="small" />
                    )}
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create/Edit Note Dialog */}
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
          {currentNote ? "Edit Note" : "Create New Note"}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              autoFocus
              margin="normal"
              name="title"
              label="Title"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.title}
              onChange={handleInputChange}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              margin="normal"
              name="content"
              label="Content"
              type="text"
              fullWidth
              multiline
              rows={6}
              variant="outlined"
              value={formData.content}
              onChange={handleInputChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            {/* Category Selector */}
            <Autocomplete
              multiple
              options={allCategories}
              getOptionLabel={(option) => option.name}
              value={selectedCategories}
              onChange={(event, newValue) => {
                setSelectedCategories(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Categories"
                  placeholder="Select categories"
                  margin="normal"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              )}
              sx={{ mt: 2 }}
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
            disabled={!formData.title.trim()}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3,
              boxShadow: "none",
            }}
          >
            {currentNote ? "Update Note" : "Create Note"}
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

export default NotePage;
