import React, {useState} from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {createProject, getProject, joinProject} from "../services/Project";
import useToken from "./useToken";
import {useRecoilState} from "recoil";
import {ProjectAtom} from "../atoms/ProjectAtom";
import { MenuItem, Select} from "@material-ui/core";

const NewProjectDialog = ({open, handleClose}) => {

    const [setProjectState] = useRecoilState(ProjectAtom);
    const [projectName, setProjectName] = useState("");
    const [languageSelected, setLanguageSelected] = useState("");
    const [error, setError] = useState(false);
    const [errorLanguage, setErrorLanguage] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const {token} = useToken();

    const handleProjectNameChange = ({target: {value}}) => {
        resetState()
        setProjectName(value);
    }

    const handleLanguageChange = ({target: {value}}) => {
        resetState()
        setLanguageSelected(value);
    }

    const handleCreateClick = async () => {

        if (projectName === "") {
            setError(true);
            setErrorMsg("Project name is required");
            return;
        }

        if (languageSelected === "") {
            setErrorLanguage(true);
            setErrorMsg("Please select a language");
            return;
        }

        const response = await createProject(token, projectName, languageSelected);

        if (response.error) {
            setErrorMsg("Something went wrong");
            return
        }

        resetState();
        setProjectName("");
        setLanguageSelected("");
        handleClose();

        //Get project and set it in project state
        const project = await getProject(token, null, response.location);

        const joinRequest = await joinProject(token, project.token);

        if(joinRequest.error) {
            console.log("Join error");
            return;
        }

        setProjectState(JSON.stringify(project));


    }

    const resetState = () => {
        setErrorMsg("");
        setError(false);
        setErrorLanguage(false);
    }

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">New project</DialogTitle>
            <DialogContent>
                <TextField
                    error={error}
                    value={projectName}
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Project name"
                    type="text"
                    fullWidth
                    onChange={handleProjectNameChange}
                    style={{marginBottom: "20px"}}
                />
                <Select
                    error={errorLanguage}
                    value={languageSelected}
                    onChange={handleLanguageChange}
                    fullWidth
                    displayEmpty>
                    <MenuItem value="">Your language</MenuItem>
                    <MenuItem value={"C"}>C</MenuItem>
                    <MenuItem value={"JAVA"}>Java</MenuItem>
                </Select>
                {
                    errorMsg !== "" &&
                    <p style={{color: "red", fontStyle: "italic"}}>{errorMsg}</p>
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleCreateClick} color="primary">
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default NewProjectDialog;
