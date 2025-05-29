import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectProjects, fetchProjects } from '../features/projectSlice';
import { Autocomplete, TextField, Chip, Box, CircularProgress } from '@mui/material';

const ProjectDropdown = () => {
  const dispatch = useDispatch();
  const { projects, selectedProjects, loading, error } = useSelector((state) => state.project);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const projectNames = projects.length > 0 ? [...new Set(projects.map((proj) => proj.project))] : [];

  const handleProjectSelect = (event, newValue) => {
    dispatch(selectProjects(newValue)); // Update Redux store
  };

  return (
    <Box mt={4}>
      <Autocomplete
        multiple
        options={projectNames}
        getOptionLabel={(option) => option}
        value={selectedProjects}
        onChange={handleProjectSelect}
        renderTags={(selected, getTagProps) =>
          selected.map((option, index) => (
            <Chip 
              key={option} 
              label={option} 
              {...getTagProps({ index })} 
              onDoubleClick={() => handleProjectSelect(null, selected.filter((item) => item !== option))} // Double-click to remove
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Projects"
            placeholder="Select Projects"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        sx={{
          flex: 1,
          '& .MuiAutocomplete-tag': {
            maxWidth: '100px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
          '& .MuiAutocomplete-inputRoot': {
            flexWrap: 'nowrap',
          },
        }}
      />
    </Box>
  );
};

export default ProjectDropdown;
