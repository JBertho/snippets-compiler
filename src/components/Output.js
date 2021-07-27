import React, {Fragment, useEffect, useState} from "react";
import {useRecoilValue} from "recoil";
import {OutputContentAtom} from "../atoms/OutputContentAtom";

const Output = () => {

    const contentState = useRecoilValue(OutputContentAtom);
    const [content, setContent] = useState();

    useEffect(() => {
        if (contentState !== "") {
            setContent(JSON.parse(contentState));
        }
    }, [contentState]);


    return (
        <Fragment>
            <div className={`output`}>
                <div className={'execution-output-container'}>
                    <div className={'output-header'}>
                        <p className={'output-header-title'}>Execution output</p>
                    </div>
                    <div className={'output-content'}>
                        <p>{content?.response}</p>
                    </div>
                </div>
                <div className={'analysis-output-container'}>
                    <div className={'output-header'}>
                        <p className={'output-header-title'}>Code analysis output</p>
                    </div>
                    <div className={'output-content'}>
                        <p>{content?.redundancy}</p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .output {
                    display: flex;
                    flex-direction: column;
                    width: 90%;
                    height: 90%;
                    background-color: black;
                    color: green;
                    overflow: auto;
                    z-index: 10;
                }
                
                .execution-output-container, .analysis-output-container {
                    flex: 1;
                }
                
                .output-content {
                    padding: 0 10px;
                    font-size: 15px;
                }
                
                .output-content p {
                    white-space: pre-line;
                }
                
                .output .output-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 10px;
                    max-width: 100%;
                    height: 30px;
                    background-color: #dadada;
                    margin-bottom: 10px;
                }
                
                .close {
                    cursor: pointer;
                }
                
                .close-button, .output-header-title {
                    color: black;
                }
                
                .opened {
                    animation: bottom-to-top 0.3s
                }
                
                .closed {
                    animation: top-to-bottom 0.3s
                }
                
                @keyframes bottom-to-top {
                    from {
                        bottom: -100px;
                    }
                    to {
                        bottom: 0;
                    }
                }
                
                @keyframes top-to-bottom {
                    from {
                        bottom: 0;
                    }
                    to {
                        bottom: -100px;
                    }
                }
            `}</style>
        </Fragment>
    );
}

export default Output;
