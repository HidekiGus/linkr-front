import axios from 'axios';
import styled from 'styled-components';
import { useState, useEffect, useContext, useRef } from 'react';

import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import UserContext from '../../contexts/UserContext.js';
import generateHeader from '../../utils/TokenHeaders.js';
import reqRoot from '../../utils/reqRoot';

export default function Post({ post, action }) {
    const [editing, setEditing] = useState(false);
    const [description, setDescription] = useState(post.userPostDescription);
    const [disabled, setDisabled] = useState(false);
    const { user } = useContext(UserContext);
    const config = generateHeader(user);
    const ref = useRef(null);

    const escapeHandler = (e) => {
        if (e.key === "Escape") {
            setEditing(false);
            setDescription(post.userPostDescription);
        }
    }

    const enterHandler = (e) => {
        if (e.key === "Enter") {
            sendChanges();
        }
    }

    async function sendChanges() {
        if (!editing) {
            setDisabled(true);
            try {
                const request = await axios.put(`${reqRoot}/posts/update/`, config);
                setDisabled(false)
                toggleEditing();
            } catch (err) {
                console.error('On sendChanges: ' + err);
                setDescription(post.userPostDescription);
                setTimeout(() => setDisabled(false), 3000);
            }
        } else {
            console.log("nntá editando");
        }
    }

    function toggleEditing() {
        setEditing(!editing);
    }

    useEffect(() => {
        const element = ref.current
        element.addEventListener("keypress", enterHandler, false);
        document.addEventListener("keydown", escapeHandler, false);
        return () => {
            document.removeEventListener("keydown", escapeHandler, false);
            element.removeEventListener("keypress", enterHandler, false);
        }
    }, []);

    return (
        <PostContainer>
            <PostUserPicture src={post.userImage} />
            <Icons>
                <EditIcon onClick={toggleEditing} />
                <DeleteIcon />
            </Icons>
            <PostTextBoxes>
                <PostUserName>{post.userName}</PostUserName>
                <PostUserText display={editing ? "none" : "flex"} >{description}</PostUserText>
                <TextInputEdit 
                    ref={ref}
                    display={editing ? "flex" : "none"}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={disabled}
                    opacity={disabled ? "0.8" : "1"} />
                <PostSnippetContainer onClick={action}>
                    <PostSnippetDescription>
                        <PostSnippetDescriptionH1>
                            {post.metadataTitle}
                        </PostSnippetDescriptionH1>
                        <PostSnippetDescriptionH2 isLink={false}>
                            {post.metadataDescription}
                        </PostSnippetDescriptionH2>
                        <PostSnippetDescriptionH2 isLink={true}>
                            {post.userPostLink}
                        </PostSnippetDescriptionH2>
                    </PostSnippetDescription>
                    <PostSnippetImage>
                        <img src={post.metadataImage} />
                    </PostSnippetImage>
                </PostSnippetContainer>
            </PostTextBoxes>

        </PostContainer>
    )
}

const PostContainer = styled.div`
    min-height: 300px;
    height: auto;
    width: 100%;

    background-color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;

    border-radius: 16px;
    margin: 10px 0;
    position: relative;

    background-color: #171717;

    input {
        width: 80%;
        height: 40px;
    }
`

const PostUserPicture = styled.img`
    height: 50px;
    width: 50px;
    border-radius: 27px;
    margin: 10px 20px 220px;
`

const PostUserName = styled.div`
    height: 20px;
    width: 95%;
    color: #FFFFFF;
    font-size: 20px;
`

const PostUserText = styled.div`
    min-height: 30px;
    height: auto;
    width: 95%;
    color: #B7B7B7;
    font-family: 'Lato', sans-serif;
    font-size: 17px;
    margin: 15px 0;
    display: ${props => props.display};
`

const TextInputEdit = styled.textarea`
    min-height: 30px;
    height: auto;
    width: 95%;
    color: #4C4C4C;
    background: #FFFFFF;
    border: 0 solid transparent;
    border-radius: 7px;
    font-family: 'Lato', sans-serif;
    font-size: 17px;
    margin: 15px 0;
    opacity: ${props => props.opacity};
    display: ${props => props.display};
`

const PostTextBoxes = styled.div`
    height: 100%;
    width: 85%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: column;
`

const PostSnippetContainer = styled.div`
    width: 480px;
    height: 150px;
    border-radius: 11px;
    border: 1px solid #4d4d4d;

    display: flex;
    flex-direction: row;
    overflow: hidden;

    cursor: pointer;
`

const PostSnippetDescription = styled.div`
    width: calc(100% - 150px);
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: column;
`

const PostSnippetDescriptionH1 = styled.div`
    width: 90%;
    height: 25%;
    font-size: 16px;
    line-height: 20px;
    color: #CECECE;
`

const PostSnippetDescriptionH2 = styled.div`
    width: 90%;
    height: fit-content;
    max-height: 30%;
    font-size: 11px;
    line-height: 13px;
    color: ${(props) => props.isLink ? "#CECECE" : "#9B9595"};
`

const PostSnippetImage = styled.div`
    width: 150px;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;

    img {
        max-width: 100%;
        max-height: 100%;
    }
`

const Icons = styled.div`
    width: 50px;
    height: fit-content;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    top: 38px;
    right: 20px;
`

const EditIcon = styled(FaPencilAlt)`
    width: 16px;
    height: 16px;
    color: #FFFFFF;
    cursor: pointer;
`

const DeleteIcon = styled(FaTrashAlt)`
    width: 16px;
    height: 16px;
    color: #FFFFFF;
    cursor: pointer;
`