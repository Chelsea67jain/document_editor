import React, { useEffect, useState, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { Box } from "@mui/material";
import styled from "@emotion/styled";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

const Component = styled.div`
  background: #f5f5f5;
`;

var toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ["clean"], // remove formatting button
];

const Editor = () => {
  const [quill, setQuill] = useState();
  const [socket, setSocket] = useState();
  const {id}=useParams();
  const quillRef = useRef(null);
  useEffect(() => {
    
    if (!quillRef.current) {
      const quillServer = new Quill("#container", {
        modules: {
          toolbar: toolbarOptions,
        },

        theme: "snow",
      });
      //setQuillInstant(quillServer);
      quillServer.disable();
      quillServer.setText("Loading Document...")
      setQuill(quillServer);
      quillRef.current = quillServer;
    }
  }, []);

  useEffect(() => {
    const socketServer = io("http://localhost:9000");
    setSocket(socketServer);
    return () => {
      socketServer.disconnect();
    };
  }, []);

  useEffect(() => {
    if(socket==null || quill==null) return;

    const handleChange = (delta, oldData, source) => {
      if (source !== "user") return;

      socket && socket.emit("send-changes", delta);
    };
    quill && quill.on("text-change", handleChange);

    return () => {
      quill && quill.off("text-change", handleChange);
    };
  }, [quill, socket]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const handleChange = (delta) => {
            quill.updateContents(delta);  
    };
    socket && socket.on("receive-changes", handleChange);

    return () => {
      socket && socket.off("receive-changes", handleChange);
    };
  }, [quill, socket]);
  
  useEffect(()=>{
  if(quill==null || socket==null ||id==null) return ;
   socket && socket.once('load-document',document=>{
    quill && quill.setContents(document);
    quill && quill.enable();
   })
  socket&& socket.emit('get-document',id);
   
  },[quill,socket,id])
  return (
    <Component>
      <Box
        sx={{
          width: "60%",
          background: "#fff",
          boxShadow: "0px 0px 5px rgba(0,0,0,0.5)",
          marginLeft: 10,
          marginTop: "auto",
          marginBottom: "auto",
          marginRight: 10,
          height: "100vh",
        }}
        id="container"
      >
        {" "}
      </Box>
    </Component>
  );
};

export default Editor;
