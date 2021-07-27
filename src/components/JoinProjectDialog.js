import React, {useState} from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {getProject, joinProject} from "../services/Project";
import useToken from "./useToken";
import {useSetRecoilState} from "recoil";
import {ProjectAtom} from "../atoms/ProjectAtom";
import {CodeAtom} from "../atoms/CodeAtom";
import {getSnippets} from "../services/Snippets";

const JoinProjectDialog = ({open, handleClose}) => {

    const setProjectState = useSetRecoilState(ProjectAtom);
    const setCodeState = useSetRecoilState(CodeAtom);
    const [projectToken, setProjectToken] = useState("");
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const {token} = useToken();

    const handleProjectTokenChange = ({target: {value}}) => {
        resetState()
        setProjectToken(value);
    }

    const handleJoinClick = async () => {

        if (projectToken === "") {
            setError(true);
            setErrorMsg("Project token is required");
            return;
        }

        const response = await joinProject(token, projectToken);

        if (response.error) {
            setErrorMsg("Project not found");
            return
        }

        resetState();
        setProjectToken("");
        handleClose();

        //Get project and set it in project state
        const project = await getProject(token, null, response.location);

        if(project.error) {
            console.log("Cannot get project info");
            return;
        }

        setProjectState(JSON.stringify(project));

        const projectSnippets = await getSnippets(token, project.id, null);
        if(projectSnippets.error) {
            console.log("Cannot get project snippets");
            return;
        }

        setCodeState(projectSnippets);

    }

    const resetState = () => {
        setErrorMsg("");
        setError(false);
    }

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">New project</DialogTitle>
            <DialogContent>
                <TextField
                    error={error}
                    value={projectToken}
                    autoFocus
                    margin="dense"
                    id="token"
                    label="Project token"
                    type="text"
                    fullWidth
                    onChange={handleProjectTokenChange}
                />
                {
                    errorMsg !== "" &&
                    <p>{errorMsg}</p>
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleJoinClick} color="primary">
                    Join
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default JoinProjectDialog;
