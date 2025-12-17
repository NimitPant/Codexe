import React, { useState, useEffect, useReducer, useContext } from "react";
import {
  Box,
  Button,
  Grid,
  Tabs,
  Tab,
  Alert,
  AlertTitle,
  Snackbar,
  IconButton,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import LogoutIcon from "@mui/icons-material/Logout";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

import { useTheme } from "@mui/material/styles";

import { useNavigate } from "react-router-dom";

import UserSpaces from "../components/Dashboard/UserSpaces";
import UserSettings from "../components/Dashboard/UserSettings";
import Profile from "../components/Dashboard/Profile";

import { useAxios } from "../hooks/useAxios";
import useAuth from "../hooks/useAuth";
import useLocalStorage from "../hooks/useLocalStorage";

import { ColorModeContext } from "../context/ColorModeContext";

// FOR TAB-SWITCHING LOGIC
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};


// OBJECT IS USED TO MANAGE/STORE THE STATE OF THE DASHBOARD
// USED WITH THE REDUCER FUNCTION BELOW


const initialState = {
  value: 0,  // value of the tab
  listSpace: undefined,  // list of spaces, filtered on the basis of search query
  originalSpace: null,  // original list of spaces, master list
  spaceId: "",
  spaceName: "",
  showCreateSpaceBackdrop: false,
  showJoinSpaceBackdrop: false,
};

// FUNCTION USED TO UPDATE THE STATE OF THE DASHBOARD
// USES THE INITIAL STATE OBJECT ABOVE
function reducer(state, action) {
  switch (action.type) {
    case "updateValue":
      return { ...state, value: action.payload };
    case "updateListSpaces":
      return { ...state, listSpaces: action.payload };
    case "updateOriginalSpaces":
      return { ...state, originalSpace: action.payload };
    case "updateSpaceId":
      return { ...state, spaceId: action.payload };
    case "updateSpaceName":
      return { ...state, spaceName: action.payload };
    case "handleCreateBackdrop":
      return { ...state, showCreateSpaceBackdrop: action.payload };
    case "handleJoinBackdrop":
      return { ...state, showJoinSpaceBackdrop: action.payload };
    default:
      throw new Error();
  }
}

function Dashboard() {
  const { auth, setAuth } = useAuth();
  const [localUser, setLocalUser] = useLocalStorage("user", null);
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [success, setSuccess] = useState(false);
  // const [value, setValue]=useState(0);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState({ title: "", data: "" });
  const colorMode = useContext(ColorModeContext);
  const theme = useTheme();
  const { response, error: responseError } = useAxios({
    method: "GET",
    url: "/spaces",
    headers: { Authorization: `Bearer ${auth.token}` },
  });

  useEffect(() => {
    document.title = "Dashboard";
  }, []);

  useEffect(() => {
    if (!localUser) {
      setLocalUser(auth);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localUser]);

  useEffect(() => {
    if (responseError !== undefined) {
      setMessage({
        title: "error!",
        data: "Can't get your spaces. Try again later!",
      });
      setError(true);
      return;
    }

    if (response === undefined) return;

    dispatch({ type: "updateListSpaces", payload: response.data });
    dispatch({ type: "updateOriginalSpaces", payload: response.data });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);


  const handleLogout = () => {
    setAuth(null);
    localStorage.setItem("user", null);
    navigate("/", { replace: true });
  };

  return (
    <>

      <Snackbar // ERROR SNACKBAR
        open={error}
        onClose={() => setError(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={3000}
      >
        <Alert variant="filled" severity="error" sx={{ width: "100%" }}>
          <AlertTitle>{message.title}</AlertTitle>
          {message.data}
        </Alert>
      </Snackbar>


      <Snackbar // SUCCESS SNACKBAR
        open={success}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={3000}
      >
        <Alert variant="filled" severity="success" sx={{ width: "100%" }}>
          <AlertTitle>{message.title}</AlertTitle>
          {message.data}
        </Alert>
      </Snackbar>

      <Box // HEADER
        sx={{
          position: "fixed",
          width: "100vw",
          display: "flex",
          zIndex: 3,
          justifyContent: "space-between",
        }}
      >

        <Box // HEADER -> LOGO 
            component="img"
            sx={{
              height: "70px",
              width: "80px",
            }}
            alt="No spaces found"
            src="/logo1.png"
        />

        {/* HEADER -> THEME TOGGLE AND LOGOUT BUTTON */}
        <Box> 

          {/* HEADER -> THEME TOGGLE */}
          <IconButton onClick={colorMode.toggleColorMode}> 
            {theme.palette.mode === "light" ? (
              <DarkModeIcon sx={{ fontSize: 30 }} />
            ) : (
              <LightModeIcon sx={{ fontSize: 30 }} />
            )}
          </IconButton>

          {/* HEADER -> LOGOUT BUTTON */}
          <Button 
            variant="contained"
            sx={{ m: 3 }}
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>

          {/* HEADER -> PROFILE COMPONENT*/} 
          <Profile loggedInUser={auth} /> 

        </Box>
      </Box>

      {/* GRID CONTAINER BELOW THE HEADER */}
      <Grid container sx={{ minHeight: "100vh", backgroundColor: "background.default" }} >

        {/* GRID ITEM 1, TABS */}
        <Grid item xs={12} sx={{ height: "30vh" }}>
          <Box
            sx={{
              height: "10vw",
              backgroundColor: "background.paper",
              position: "fixed",
              display: "absolute",
              justifyContent: "center",
              // width: "10vw",
              ml:"30px",
              zIndex: 3,
              // boxShadow:
              //   "0px 0px 15.7px rgba(0, 0, 0, 0.1),0px 0px 125px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                ml: "auto",
                mr: "auto",
              }}
            >
              <Tabs
                value={state.value}
                onChange={(event, value) =>
                  dispatch({ type: "updateValue", payload: value })
                }
              >
                <Tab
                  icon={<WorkspacesIcon />}
                  iconPosition="start"
                  label="Sessions"
                  sx={{ pb: 1, pt: 3 }}
                />
                <Tab
                  icon={<SettingsIcon />}
                  iconPosition="start"
                  label="Settings"
                  sx={{ pb: 1, pt: 3 }}
                />
              </Tabs>
            </Box>
          </Box>
        </Grid>

        {/* GRID ITEM 2, FOR USER SPACES AND SETTINGS */}
        <Grid item xs={12} marginY={-5} sx={{ minHeight: "100vh", backgroundColor: "background.default" }} >
          <TabPanel value={state.value} index={0}>
            <UserSpaces
              setMessage={setMessage}
              setSuccess={setSuccess}
              setError={setError}
              loggedInUser={auth}
              listSpaces={state.listSpaces}
              dispatch={dispatch}
              originalSpace={state.originalSpace}
              showCreateSpaceBackdrop={state.showCreateSpaceBackdrop}
              showJoinSpaceBackdrop={state.showJoinSpaceBackdrop}
              spaceId={state.spaceId}
              spaceName={state.spaceName}
            />
          </TabPanel>
        
          
          <TabPanel value={state.value} index={1}>
            <UserSettings loggedInUser={auth} setLoggedInUser={setAuth} />
          </TabPanel>



          {/* if(value==1){
            <UserSpaces
            setMessage={setMessage}
            setSuccess={setSuccess}
            setError={setError}
            loggedInUser={auth}
            listSpaces={state.listSpaces}
            dispatch={dispatch}
            originalSpace={state.originalSpace}
            showCreateSpaceBackdrop={state.showCreateSpaceBackdrop}
            showJoinSpaceBackdrop={state.showJoinSpaceBackdrop}
            spaceId={state.spaceId}
            spaceName={state.spaceName}
          />
          }
          else{
            <UserSettings loggedInUser={auth} setLoggedInUser={setAuth} />
          } */}
        </Grid>
      </Grid>
    </>
  );
}

export default Dashboard;
