import React, {Fragment} from "react";
import Toolbar from "./Toolbar";
import {getUsername} from "../utils/Auth";
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';

const Header = ({setToken}) => {

    const username = getUsername();

    const handleLogout = () => {
        setToken(null);
    }

    return (
        <Fragment>
            <div className={'header'}>
                <div className={'logo'}>
                    <h2 className={'title'}>
                        Snippets Compiler
                        <span>
                            <PowerSettingsNewIcon className={'logout'} onClick={handleLogout} />
                            | {`Hey, ${username}! Amuse-toi 😎`}
                        </span>
                    </h2>

                </div>
                <div className={'toolbar-container'}>
                    <Toolbar />
                </div>
            </div>
            <style jsx>{`
            
                .header {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 10;
                }
                
                .logo {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    height: 100px;
                    font-family: IBM;
                    font-size: 20px;
                    letter-spacing: 2px;
                    background-color: #009dc7;
                }
                
                .title {
                    font-size: 30px;
                    text-align: center;
                }
                
                .title span {
                    display: flex;
                    justify-content: center;
                    font-family: Courier New, monospace;
                    font-size: 12px;
                    font-weight: 100;
                    margin-top: 10px
                }
                
                .logout {
                    cursor: pointer;
                }
                
                .toolbar-container {
                    display: flex;
                    justify-content: center;
                    height: 30px;
                    background-color: #dadada;
                }
            
            `}</style>
        </Fragment>
    );
}

export default Header;