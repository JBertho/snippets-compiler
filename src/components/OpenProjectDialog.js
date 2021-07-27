import React, {useState, useEffect} from "react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {getProject, getProjects} from "../services/Project";
import useToken from "./useToken";
import {useSetRecoilState} from "recoil";
import {ProjectAtom} from "../atoms/ProjectAtom";
import {CodeAtom} from "../atoms/CodeAtom";
import {getSnippets} from "../services/Snippets";
import {InputLabel, MenuItem, Select} from "@material-ui/core";

const OpenProjectDialog = ({open, handleClose}) => {

    const setProjectState = useSetRecoilState(ProjectAtom);
    const setCodeState = useSetRecoilState(CodeAtom);
    const [projects, setProjects] = useState([]);
    const [projectSelected, setProjectSelected] = useState("");
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const {token} = useToken();

    useEffect(() => {
        async function getProjectsList() {
            const projectsList = await getProjects(token);

            if (projectsList.error) {
                setErrorMsg("Cannot get project list");
                return;
            }

            setProjects(projectsList);
        }

        getProjectsList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const handleProjectChange = ({target: {value}}) => {
        resetState()
        setProjectSelected(value);
    }

    const handleOpenClick = async () => {

        if (!projectSelected) {
            setError(true);
            setErrorMsg("Please select a project");
            return;
        }

        const response = await getProject(token, projectSelected, null);

        if (response.error) {
            setErrorMsg("Project not found");
            return;
        }

        resetState();
        setProjectSelected("");
        handleClose();

        // Get project snippets
        const projectSnippets = await getSnippets(token, response.id, null);

        if (projectSnippets.error) {
            setErrorMsg("Cannot get snippets");
            return;
        }

        setProjectState(JSON.stringify(response));
        setCodeState(projectSnippets);


    }

    const resetState = () => {
        setErrorMsg("");
        setError(false);
    }

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Select project</DialogTitle>
            <DialogContent>
                <InputLabel id="demo-simple-select-filled-label">Projects</InputLabel>
                <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    error={error}
                    value={projectSelected}
                    onChange={handleProjectChange}
                    fullWidth
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {
                        projects.map((project) => (
                            <MenuItem value={project.id}>{project.name}</MenuItem>
                        ))
                    }

                </Select>
                {
                    errorMsg !== "" &&
                    <p>{errorMsg}</p>
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleOpenClick} color="primary">
                    Open
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default OpenProjectDialog;
