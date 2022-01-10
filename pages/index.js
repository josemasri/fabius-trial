import { Button, IconButton, Snackbar, Typography } from "@mui/material";
import Papa from "papaparse";
import { DataGrid } from "@mui/x-data-grid";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import FilterIcon from "@mui/icons-material/FilterAlt";
import CloseIcon from "@mui/icons-material/Close";
import { v4 as uuid } from "uuid";

import { useRef, useState, useEffect } from "react";

const columns = [
  { field: "donor_id", headerName: "ID" },
  { field: "donor_name", headerName: "Name" },
  { field: "donor_email", headerName: "Email" },
  {
    field: "donor_gender",
    headerName: "Gender"
  },
  {
    field: "donor_address",
    headerName: "Address"
  },
  {
    field: "donation_amount",
    headerName: "Amount",
    type: "number"
  }
];

export default function DataTable() {
  const inputFile = useRef(null);
  const [rows, setRows] = useState([]);
  const [anonymousDonations, setAnonymousDonations] = useState([]);
  const [namedDonations, setNamedDonations] = useState([]);
  const [isHideAnonymous, setIsHideAnonymous] = useState(false);

  const [file, setFile] = useState();
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const toggleHideAnonymous = () => {};

  const onButtonClick = () => {
    inputFile.current.files = new FileList();
    inputFile.current.click();
  };

  const onFileUpload = (e) => {
    setFile(e.target.files[0]);
    Papa.parse(e.target.files[0], {
      header: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          console.log(results.errors);
          setSnackbarMessage("An error ocurred uploading some CSV rows");
          setIsSnackbarOpen(true);
        }
        const data = results.data
          .filter((item) => item.donor_id && item.donation_amount)
          .map((item) => {
            item.id = uuid();
            return item;
          });
        const tempAnonymousDonations = data.filter((item) => !item.donor_name);
        setAnonymousDonations(tempAnonymousDonations);
        localStorage.setItem(
          "anonymousDonations",
          JSON.stringify(tempAnonymousDonations)
        );
        const tempNamedDonations = data.filter((item) => item.donor_name);
        setNamedDonations(tempNamedDonations);
        localStorage.setItem(
          "namedDonations",
          JSON.stringify(tempNamedDonations)
        );
        setRows(data);
        localStorage.setItem("donations", JSON.stringify(data));
      }
    });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsSnackbarOpen(false);
  };

  useEffect(() => {
    const initialDonations =
      JSON.parse(localStorage.getItem("donations")) || [];
    setRows(initialDonations);
    const tempAnonymousDonations =
      JSON.parse(localStorage.getItem("anonymousDonations")) || [];
    setAnonymousDonations(tempAnonymousDonations);
    const tempNamedDonations =
      JSON.parse(localStorage.getItem("namedDonations")) || [];
    setNamedDonations(tempNamedDonations);
  }, []);

  const action = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <div className="table">
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        message={snackbarMessage}
        action={action}
      />
      <Typography variant="h3" component="h1">
        Donations
      </Typography>
      <div className="upload-btn">
        {rows.length > 0 && (
          <>
            <Button onClick={onButtonClick} variant="outlined">
              <FilterIcon />
              Hide Anonymous
            </Button>
            <Typography style={{ margin: "1rem" }}>
              Anonymous Donations{" "}
              {((anonymousDonations.length / rows.length) * 100).toFixed(2)}%
            </Typography>
          </>
        )}
        <Button onClick={onButtonClick} variant="outlined">
          <UploadFileIcon />
          Upload CSV
        </Button>
        {file && <Typography>{file.name}</Typography>}
        <input
          type="file"
          id="file"
          style={{ opacity: "0", position: "absolute" }}
          onChange={onFileUpload}
          ref={inputFile}
        />
      </div>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5]}
        checkboxSelection
        autoHeight={true}
      />
    </div>
  );
}
