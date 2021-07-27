import React, {Fragment} from "react";
import {useRecoilState} from "recoil";
import {CodeAtom} from "../atoms/CodeAtom";
import {ProjectAtom} from "../atoms/ProjectAtom";
import {createSnippet, getSnippets} from "../services/Snippets";
import useToken from "./useToken";


const Menu = ({setNewProjectDialogOpen, setOpenProjectDialogOpen, setJoinProjectDialogOpen}) => {

    const [project, setProject] = useRecoilState(ProjectAtom);
    const [code, setCode] = useRecoilState(CodeAtom);
    const {token} = useToken();

    const handleAddBlock = (snippetData) => {
        //Adding new block
        setCode(snippetData);
    }

    const handleNewSnippet = async () => {
        if (project === "") {
            setNewProjectDialogOpen(true);
        } else {
            const projectObject = JSON.parse(project);
            const snippetName = "new snippet " + (code.length + 1);
            const codeValue = "";
            const response = await createSnippet(token, snippetName, codeValue, projectObject.id);

            if(response.error) {
                console.log("error");
                return;
            }

            const snippetData = await getSnippets(token, null, response.location);
            console.log(snippetData);

            if(snippetData.error){
                console.log("Cannot get snippets for this project");
                return;
            }

            handleAddBlock(snippetData);
        }
    }

    const handleCloseProject = () => {
        setProject("");
        setCode([]);
    }

    const handleNewProject = () => {
        setNewProjectDialogOpen(true);
    }

    const handleOpenProject = () => {
        setOpenProjectDialogOpen(true);
    }

    const handleJoinProject = () => {
        setJoinProjectDialogOpen(true);
    }

    return (
        <Fragment>
            <ul className={'menu-container'}>
                <li onClick={handleNewProject}>New project</li>
                <li onClick={handleNewSnippet}>New snippet</li>
                <li onClick={handleOpenProject}>Open project</li>
                <li onClick={handleJoinProject}>Join project</li>
                <li onClick={handleCloseProject}>Close project</li>
            </ul>

            <style jsx>{`
                .menu .menu-container {
                    left: 0;
                    position: absolute;
                    background-color: #dadada;
                    width: 200px;
                    list-style: none;
                    padding: 5px;
                    top: 15px;
                    
                }
               
                .menu-container li {
                    height: 30px;
                }
                
                .menu-container li:hover {
                    background-color: grey
                }
            `}</style>
        </Fragment>
    );
}

export default Menu;
