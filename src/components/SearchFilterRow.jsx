import { TableRow, TableCell, TextField, InputAdornment, IconButton } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { setSearchValue } from "../features/searchSlice";
import { IoCloseCircle } from "react-icons/io5"; // Close (X) Icon

const SearchFilterRow = ({ columns }) => {
  const dispatch = useDispatch();
  const searchValues = useSelector((state) => state.search.searchValues);

  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell key={column.id}>
          <TextField
            size="small"
            variant="outlined"
            placeholder={`Search ${column.label}`}
            value={searchValues[column.id] || ""}
            onChange={(e) =>
              dispatch(setSearchValue({ columnId: column.id, value: e.target.value }))
            }
            sx={{
              width: "100%",
              maxWidth: "150px", // Keep max width
              height: "30px", // Keep height
              "& .MuiOutlinedInput-root": {
                borderRadius: "6px",
                fontSize: "12px",
                padding: "5px",
              },
              "& input": {
                padding: "5px 10px",
              },
            }}
            InputProps={{
              endAdornment: searchValues[column.id] ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => dispatch(setSearchValue({ columnId: column.id, value: "" }))}
                  >
                    <IoCloseCircle size={16} color="gray" />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
          />
        </TableCell>
      ))}
    </TableRow>
  );
};

export default SearchFilterRow;
