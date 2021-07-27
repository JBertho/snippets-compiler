import React, {Fragment, useEffect, useState} from "react";
import AceEditor from "react-ace";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {CodeAtom} from "../atoms/CodeAtom";
import {removeItemAtIndex, replaceItemAtIndex} from "../utils/ArrayUtils";

import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools"
import RunSnippet from "./RunSnippet";
import {compile} from "../services/Compiler";
import DeleteSnippet from "./DeleteSnippet";
import useToken from "./useToken";
import {deleteSnippet, updateSnippet} from "../services/Snippets";
import {OutputContentAtom} from "../atoms/OutputContentAtom";
import SnippetName from "./SnippetName";
import {ProjectAtom} from "../atoms/ProjectAtom";

const CodeEditor = ({key, code}) => {

    const [codeValue, setCodeValue] = useState(code.content);
    const [actuallyEdited, setActuallyEdited] = useState(false);
    const setOutputContent = useSetRecoilState(OutputContentAtom);
    const [codeAtom, setCodeAtom] = useRecoilState(CodeAtom);
    const projectState = useRecoilValue(ProjectAtom);
    const {token} = useToken();
    const index = codeAtom.findIndex((el) => el.id === code.id);
    let snippet = codeAtom.find((el) => el.id === code.id);
    const [snippetName, setSnippetName] = useState(snippet?.name);
    const [userName, setUserName] = useState("");
    const [action, setAction] = useState("");
    const [mode, setMode] = useState("");


    useEffect(() => {

        function initMode() {
            if (projectState !== "") {
                const project = JSON.parse(projectState);
                switch (project.language) {
                    case "C":
                        setMode("c_cpp");
                        break;
                    case "JAVA":
                        setMode("java");
                        break;
                    default:
                        setMode("c_cpp");
                }
            }
        }

        function checkEdit() {
            const currentDate = new Date();
            const snippetUpdateDate = new Date(snippet?.updateDate);
            const minutesBetweenNowAndLastEditingDate = (currentDate - snippetUpdateDate) / 30000;

            if (snippet) {
                if (minutesBetweenNowAndLastEditingDate < 1) {
                    setActuallyEdited(true);
                    setUserName(actionUserName(snippet.updateUserName));
                    setAction("coding... 👨🏻‍💻🚀");
                } else {
                    setActuallyEdited(false);


                    setSnippetName(snippet.name);
                    if (snippet.updateDate) {

                        setUserName(actionUserName(snippet.updateUserName));
                        setAction("updated by ");

                    } else {
                        setUserName(actionUserName(snippet.createUserName));
                        setAction("created by ");
                    }
                }
            }
        }

        initMode();
        checkEdit();
    });

    useEffect(() => setCodeValue(code.content), [code]);

    const actionUserName = (username) => {
        const userInfo = localStorage.getItem('userInfo');
        const user = JSON.parse(userInfo);
        return username === user?.username ? "me" : username;
    }

    const randomColor = () => {
        const actionUser = actionUserName(snippet?.updateUserName);
        let color = "";
        if(actionUser === "me") {
            color = "red";
        }else {
            //color = '#'+Math.random().toString(16).slice(-3);
            color = "#05b4f7";
        }
        return color;
    }

    const handleCodeChange = (value) => {
        setCodeValue(value);
        updateValueFromKey(code.id, value);
        handleUpdateCodeBlock(value);
    }

    const updateValueFromKey = (key, value) => {

        const newSnippet = {
            content: value,
            createUserId: snippet.createUserId,
            createdDate: snippet.createdDate,
            createUserName: snippet.createUserName,
            id: snippet.id,
            name: snippet.name,
            projectId: snippet.projectId,
            updateDate: snippet.updateDate,
            updateUserId: snippet.updateUserId,
            updateUserName: snippet.updateUserName
        }

        const newCodeList = replaceItemAtIndex(codeAtom, index, newSnippet);

        setCodeAtom(newCodeList)
    }

    const handleRunCode = async () => {
        const output = JSON.stringify({response: "Compilation start...", redundancy: "Code analysis also start..."});
        setOutputContent(output);
        //Send code to server for compilation
        const response = await compile(token, [code.id], code.projectId);
        setOutputContent(JSON.stringify(response));

    }

    const handleUpdateCodeBlock = async (value, name = snippet.name) => {
        const response = await updateSnippet(token, snippet.id, name, value, snippet.projectId);

        if (response.error) {
            console.log("Cannot update");
            return;
        }
    }

    const handleUpdateSnippetName = (name) => {
        setSnippetName(name);
        handleUpdateCodeBlock(snippet.content, name);
    }

    const handleDeleteCodeBlock = async () => {

        const newCodeList = removeItemAtIndex(codeAtom, index)
        setCodeAtom(newCodeList);

        const response = await deleteSnippet(token, snippet.id);
        if (response.error) {
            console.log("Cannot delete");
            return;
        }
    }

    return (
        <Fragment>
            <div key={key} className={'code-block-' + code.id}>
                <span className={'code-name'}>
                    <SnippetName name={snippetName} onBlur={handleUpdateSnippetName}/> / {actuallyEdited ?
                    <Fragment>
                        <b>{userName === "me" ? "I'm" : userName + "'s"}</b> {action}
                    </Fragment> :
                    <Fragment>
                        {action} <b>{userName}</b>
                    </Fragment>
                }
                </span>
                <AceEditor
                    mode={mode}
                    placeholder="Allez, écris un beau snippet ! 🔥"
                    theme={'monokai'}
                    name={'codeblock-' + code.id}
                    value={codeValue}
                    onChange={handleCodeChange}
                    fontSize={14}
                    showPrintMargin={true}
                    showGutter={true}
                    highlightActiveLine={true}
                    setOptions={{
                        enableBasicAutocompletion: false,
                        enableLiveAutocompletion: false,
                        enableSnippets: false,
                        showLineNumbers: true,
                        tabSize: 4,
                    }}/>
                <DeleteSnippet onClick={handleDeleteCodeBlock} className={'delete-snippet-' + code.id}/>
                <RunSnippet onClick={() => handleRunCode(codeValue)} className={'play-snippet-' + code.id}/>
            </div>
            <style jsx>{`
                .code-block-${code.id} {
                    margin: 30px auto 0 auto;
                    height: 100px !important;
                    border-radius: 5px 5px 0 0;
                    width: fit-content;
                    position: relative;
                    text-align: right;
                }
                
                #codeblock-${code.id} {
                    border: ${actuallyEdited ? '2px solid ' + randomColor() : ''};
                }
                
                .code-block-${code.id} .code-name {
                    font-size: 12px;
                    letter-spacing: 1px;
                    font-family: Courier New, monospace;
                    
                }
                
                .play-snippet-${code.id} {
                    color: green;
                    font-size: 22px;
                    cursor: pointer;
                }
                
                .delete-snippet-${code.id} {
                    color: red;
                    font-size: 20px;
                    cursor: pointer;
                }
                
                .code-block-${code.id} .play-snippet-${code.id} {
                    position: absolute;
                    top: 20px;
                    right: 10px;
                }
                
                .code-block-${code.id} .delete-snippet-${code.id} {
                    position: absolute;
                    top: 20px;
                    right: 30px;
                }
                
                .code-block-${code.id} #codeblock-${code.id} {
                    width: 500px;
                    min-height: 100%;
                    height: unset !important;
                }
                
                .snippet-output-${code.id} {
                    margin: 0 auto;
                }
            `}</style>
        </Fragment>
    );
}

export default CodeEditor;
