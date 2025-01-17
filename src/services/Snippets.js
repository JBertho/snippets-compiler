const snippetsRoute = process.env.REACT_APP_BACK_URL + "/api/snippets";

export const createSnippet = async (token, name, content, projectID) => {

    const snippetInfo = {
        name: name,
        content: content,
        projectId: projectID
    }

    let response = await fetch(snippetsRoute, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(snippetInfo),
    });

    if(response.status === 201){
        response = {error: false, location: response.headers.get("Location")};
    }else {
        response = {error: true};
    }

    return response;
}

export const updateSnippet = async (token, snippetID, name, content, projectID) => {

    const snippetInfo = {
        id: snippetID,
        name: name,
        content: content,
        projectId: projectID
    }

    let response = await fetch(snippetsRoute, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(snippetInfo)
    });

    if(response.status === 200){
        response = {error: false};
    }else {
        response = {error: true};
    }

    return response;
}

export const deleteSnippet = async (token, snippetID) => {
    const url = `${snippetsRoute}/${snippetID}`;

    let response = await fetch(url, {
        method: 'DELETE',
        headers: {
            "Authorization": `Bearer ${token}`
        },
    });

    if(response.status === 204){
        response = {error: false};
    }else {
        response = {error: true};
    }

    return response;
}

export const getSnippets = async (token, projectID, snippetsProjectUrl) => {
    const url = projectID ? `${snippetsRoute}/project/${projectID}` : snippetsProjectUrl;

    let response = await fetch(url, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`
        },
    });

    if(response.status === 200){
        response = await response.json();
    }else {
        response = {error: true};
    }

    return response;
}