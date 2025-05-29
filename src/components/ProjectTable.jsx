import { useSelector, useDispatch } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import { toggleEmailSelection } from "../features/emailSlice";
import { toggleArchiveSelection } from "../features/archiveSlice";
import { setSearchValue } from "../features/searchSlice"; // Redux search handling
import EmailSelection from "./EmailSelection";
import ArchiveSelection from "./ArchiveSelection";
import SendEmail from "./SendEmail";
import SearchFilterRow from "./SearchFilterRow";

const ProjectTable = () => {
  const dispatch = useDispatch();
  const { projects, selectedProjects } = useSelector((state) => state.project);
  const { selectedEmailRows } = useSelector((state) => state.email);
  const { selectedArchiveRows } = useSelector((state) => state.archive);
  const searchValues = useSelector((state) => state.search.searchValues);

  // Filtering and sorting projects
  const filteredProjects = projects
    .filter((proj) =>
      selectedProjects.includes(proj.project) &&
      Object.keys(searchValues).every((key) =>
        proj[key]?.toLowerCase().includes(searchValues[key].toLowerCase())
      )
    )
    .sort((a, b) => {
      const aMatches = a.supplier.toLowerCase().includes(searchValues.supplier?.toLowerCase() || "");
      const bMatches = b.supplier.toLowerCase().includes(searchValues.supplier?.toLowerCase() || "");
      return bMatches - aMatches; // Matching suppliers move to the top
    });

  // Table Columns
  const columns = [
    { id: "ipConfig", label: "IP Configuration" },
    { id: "licenseStatus", label: "License Status" },
    { id: "ipStatus", label: "IP Status" },
    { id: "supplier", label: "Supplier" },
    { id: "cancellationDate", label: "Cancellation Date" },
    { id: "rtlFreezeDate", label: "Freeze Date" },
    { id: "tapeOutDate", label: "Tape Out Date" },
    { id: "requesterEmail", label: "Requester Email" },
    { id: "pid", label: "Pid" },
  ];

  return (
    <>
      <TableContainer component={Paper} sx={{ maxHeight: 450, overflowY: "auto" }}>
        <Table stickyHeader>
          <TableHead>
            {/* Search Filter Row for all columns */}
            
            
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} sx={{ whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <Typography fontWeight="bold">{column.label}</Typography>

                    {/* Filter icon only for the Supplier column */}
                    {column.id === "supplier" && (
                      <Tooltip title="Filter Suppliers">
                        <IconButton
                          size="small"
                          onClick={() => dispatch(setSearchValue({ columnId: "supplier", value: "" }))}
                          sx={{ padding: "2px" }}
                        >
                         
                        </IconButton>
                      </Tooltip>
                    )}
                  </div>
                </TableCell>
              ))}

              {/* Placeholder for Email Filter Column */}
              <TableCell>
                <div style={{display: "flex", alignItems: "center", gap: "5px"}}>
                <Typography fontWeight="bold">Email</Typography>
                <EmailSelection />
                </div>
               
              </TableCell>

              {/* Placeholder for Archive Filter Column */}
              <TableCell>
                <div style={{display: "flex", alignItems: "center", gap: "5px"}}>
                <Typography fontWeight="bold">Archive</Typography>
                <ArchiveSelection />
                </div>
               
              </TableCell>
            </TableRow>
          </TableHead>
          <SearchFilterRow columns={[...columns, { id: "email" }, { id: "archive" }]} />

          <TableBody>
            {filteredProjects.map((row) => (
              <TableRow key={row._id}>
                {columns.map((column) => (
                  <TableCell key={column.id}>{row[column.id] || "N/A"}</TableCell>
                ))}

                {/* Email Checkbox */}
                <TableCell>
                  <Checkbox
                    checked={selectedEmailRows.includes(row._id)}
                    onChange={() => dispatch(toggleEmailSelection(row._id))}
                  />
                </TableCell>

                {/* Archive Checkbox */}
                <TableCell>
                  <Checkbox
                    checked={selectedArchiveRows.includes(row._id)}
                    onChange={() => dispatch(toggleArchiveSelection(row._id))}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <SendEmail />
    </>
  );
};

export default ProjectTable;
