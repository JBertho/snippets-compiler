import React, {Fragment, useEffect, useState} from "react";
import {useRecoilState} from "recoil";
import {CodeAtom} from "../atoms/CodeAtom";
import CodeEditor from "../components/CodeEditor";
import Output from "../components/Output";
import useToken from "../components/useToken";
import {getSnippets} from "../services/Snippets";
import {ProjectAtom} from "../atoms/ProjectAtom";

const Content = () => {

    const [codeValue, setCodeValue] = useRecoilState(CodeAtom);
    const [projectString] = useRecoilState(ProjectAtom);
    const [codeBlocks, setCodeBlocks] = useState(codeValue);
    const {token} = useToken();
    const MINUTE_MS = 1500;

    useEffect(() => {
        async function refreshCodeBlockState() {
            if(projectString !== "") {
                const project = JSON.parse(projectString);
                const response = await getSnippets(token, project.id, null);

                if (response.error) {
                    console.log("Cannot refresh state");
                    return;
                }

                setCodeValue(response);
            }
        }

        const interval = setInterval(() => {
            refreshCodeBlockState();
        }, MINUTE_MS);

        return () => clearInterval(interval);
    });

    useEffect(() => setCodeBlocks(codeValue), [codeValue]);

    return (
        <Fragment>
            <div className={'content'}>
                <div className={'code-blocks-container'}>
                    {
                        codeBlocks.map((code) => (
                            <CodeEditor key={code.id} code={code} />
                        ))
                    }
                </div>
                <div className={'output-container'}>
                    {
                        codeBlocks.length !== 0 &&
                        <Output />
                    }
                </div>
            </div>

            <style jsx>{`
                .content {
                    display: flex;
                    justify-content: center;
                    position: fixed;
                    bottom: 0;
                    right: 0;
                    left: 0;
                    top: 130px;
                    padding-top: 20px; 
                    overflow: auto;
                    z-index: 9;
                }
                
                .content .code-blocks-container {
                    flex: 1;
                    min-height: 100%;
                }
                
                .content .output-container {
                    flex: 1;
                    min-height: 100%;
                }
            `}</style>
        </Fragment>
    );
}

export default Content;
