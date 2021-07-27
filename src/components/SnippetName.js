import React, {useState, Fragment} from 'react';
import EditIcon from '@material-ui/icons/Edit';

const SnippetName = ({name, onBlur}) => {

    const [edited, setEdited] = useState(false);
    const [value, setValue] = useState(name);

    const handleBlur = () => {

        if (value !== "") {
            setEdited(false);
            onBlur(value);
            return;
        }

        setValue(name);
        setEdited(false);
    }

    return (
        <Fragment>
            {
                !edited ?
                    <span onDoubleClick={() => (setEdited(true))}>
                        {value} <EditIcon style={{fontSize: "10px"}} onClick={() => setEdited(true)}/>
                    </span>
                    : <span>
                    <input
                        autoFocus
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={() => handleBlur()}/>
                </span>
            }
        </Fragment>
    )
}

export default SnippetName;
