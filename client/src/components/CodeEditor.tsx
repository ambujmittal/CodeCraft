import React, { useState, useEffect, useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { tags as t } from "@lezer/highlight";
import { draculaInit } from "@uiw/codemirror-theme-dracula";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { updateCodeValue } from "@/redux/slices/compilerSlice";
import io from "socket.io-client";
import debounce from "lodash.debounce";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

//"http://localhost:4000"
const socket: SocketIOClient.Socket = io(
  "https://codecraft-5eaq.onrender.com",
  {
    transports: ["websocket"],
    transportOptions: {
      websocket: {
        withCredentials: true,
      },
    },
  }
);

export default function CodeEditor() {
  const currentLanguage = useSelector(
    (state: RootState) => state.compilerSlice.currentLanguage
  );
  const fullCode = useSelector(
    (state: RootState) => state.compilerSlice.fullCode
  );
  const currentUser = useSelector(
    (state: RootState) => state.appSlice.currentUser
  );
  const dispatch = useDispatch();
  const userID = currentUser.email;
  const userName = currentUser.username || "Guest";

  const [activeTypingUser, setActiveTypingUser] = useState<string | null>(null);

  const emitTypingEvent = useMemo(
    () =>
      debounce((isTyping: boolean) => {
        socket.emit(isTyping ? "start-typing" : "stop-typing", {
          userID,
          userName,
        });
      }, 400),
    []
  );
  useEffect(() => {
    socket.on(
      "user-typing",
      ({ userID, userName }: { userID: string; userName: string }) => {
        if (activeTypingUser !== userID) {
          setActiveTypingUser(userID);
          toast(`${userName} is typing...`);
        }
      }
    );

    socket.on("user-stopped-typing", ({ userID }: { userID: string }) => {
      if (activeTypingUser === userID) {
        setActiveTypingUser(null);
      }
    });

    return () => {
      socket.off("user-typing");
      socket.off("user-stopped-typing");
    };
  }, [activeTypingUser]);

  const emitCodeChange = useMemo(
    () =>
      debounce((newCode: string) => {
        socket.emit("code-change", newCode);
      }, 300),
    []
  );
  const { urlId: RoomID } = useParams();

  useEffect(() => {
    if (!socket) return;

    socket.once("load-code", (code: string) => {
      dispatch(updateCodeValue(code));
    });
    socket.emit("join-room", RoomID);
    return () => {
      socket.off("load-code");
    };
  }, [RoomID]);

  useEffect(() => {
    socket.on("update-code", (newCode: string) =>
      dispatch(updateCodeValue(newCode))
    );
    return () => {
      socket.off("update-code");
    };
  }, []);

  const onChange = React.useCallback(
    (value: string) => {
      dispatch(updateCodeValue(value));
      emitCodeChange(value);
      emitTypingEvent(true);
      setTimeout(() => emitTypingEvent(false), 2000);
    },
    [dispatch]
  );

  return (
    <CodeMirror
      value={fullCode[currentLanguage]}
      height="calc(100vh - 60px - 50px)"
      className="code-editor [&>.cm-editor]:text-[10px] [&>.cm-editor]:md:text-[13px]"
      extensions={[loadLanguage(currentLanguage)!]}
      onChange={onChange}
      theme={draculaInit({
        settings: {
          caret: "#c6c6c6",
          fontFamily: "monospace",
        },
        styles: [{ tag: t.comment, color: "#6272a4" }],
      })}
    />
  );
}
