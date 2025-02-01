import { Copy, Download, PencilLine, Save, Share2 } from "lucide-react";
import { Button } from "./ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import {
  CompilerSliceStateType,
  updateCurrentLanguage,
} from "@/redux/slices/compilerSlice";
import { RootState } from "@/redux/store";
import { handleError } from "@/utils/handleError";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useEditCodeMutation, useSaveCodeMutation } from "@/redux/slices/api";
import { Input } from "./ui/input";

export default function HelperHeader() {
  const isOwner = useSelector(
    (state: RootState) => state.compilerSlice.isOwner
  );
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [postTitle, setPostTitle] = useState<string>("");

  const navigate = useNavigate();
  const fullCode = useSelector(
    (state: RootState) => state.compilerSlice.fullCode
  );
  const [saveCode, { isLoading }] = useSaveCodeMutation();
  const [editCode, { isLoading: codeEditLoading }] = useEditCodeMutation();
  const user = useSelector(
    (state: RootState) => state.appSlice.currentUser.username
  );
  const isLoggedIn = useSelector(
    (state: RootState) => state.appSlice.isLoggedIn
  );

  const handleDownloadCode = () => {
    if (
      fullCode.html === "" &&
      fullCode.css === "" &&
      fullCode.javascript === ""
    ) {
      toast("Error: Code is Empty");
    } else {
      const htmlCode = new Blob([fullCode.html], { type: "text/html" });
      const cssCode = new Blob([fullCode.css], { type: "text/css" });
      const javascriptCode = new Blob([fullCode.javascript], {
        type: "text/javascript",
      });

      const htmlLink = document.createElement("a");
      const cssLink = document.createElement("a");
      const javascriptLink = document.createElement("a");

      htmlLink.href = URL.createObjectURL(htmlCode);
      htmlLink.download = "index.html";
      document.body.appendChild(htmlLink);

      cssLink.href = URL.createObjectURL(cssCode);
      cssLink.download = "style.css";
      document.body.appendChild(cssLink);

      javascriptLink.href = URL.createObjectURL(javascriptCode);
      javascriptLink.download = "script.js";
      document.body.appendChild(javascriptLink);

      if (fullCode.html !== "") {
        htmlLink.click();
      }
      if (fullCode.css !== "") {
        cssLink.click();
      }
      if (fullCode.javascript !== "") {
        javascriptLink.click();
      }

      document.body.removeChild(htmlLink);
      document.body.removeChild(cssLink);
      document.body.removeChild(javascriptLink);
    }
  };

  const { urlId } = useParams();
  useEffect(() => {
    if (urlId) {
      setIsSaved(true);
    } else {
      setIsSaved(false);
    }
  }, [urlId]);

  const handleSaveCode = async () => {
    const body = {
      fullCode: fullCode,
      title: postTitle,
      ownerName: user!,
    };
    try {
      const response = await saveCode(body).unwrap();
      navigate(`/compiler/${response.url}`, { replace: true });
    } catch (error) {
      handleError(error);
    }
  };

  const handleEditCode = async () => {
    try {
      if (urlId) {
        await editCode({ fullCode, id: urlId }).unwrap();
        toast("Code Updated Successully!");
      }
    } catch (error) {
      handleError(error);
    }
  };

  const dispatch = useDispatch();
  const currentLanguage = useSelector(
    (state: RootState) => state.compilerSlice.currentLanguage
  );
  return (
    <div className="__helper_header h-[60px] bg-black text-white p-2 flex justify-between items-center">
      <div className="__btn_container flex gap-2">
        {isLoggedIn && (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                title="Save Code"
                variant="success"
                size="icon"
                loading={isLoading}
              >
                <Save size={18} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex gap-1 justify-center items-center">
                  Save your Code!
                </DialogTitle>
                <div className="__url flex justify-center items-center p-2 gap-3">
                  <Input
                    className="bg-slate-700 focus-visible:ring-0"
                    placeholder="Project Name"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                  />
                  <Button
                    title="Save Code"
                    variant="success"
                    className="h-full"
                    onClick={handleSaveCode}
                  >
                    Save
                  </Button>
                </div>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
        <Button
          title="Download Code"
          onClick={handleDownloadCode}
          size="icon"
          variant="success"
        >
          <Download size={18} />
        </Button>

        {isSaved && (
          <>
            {isOwner && (
              <Button
                title="Edit Code"
                loading={codeEditLoading}
                onClick={handleEditCode}
                variant="success"
                size={"icon"}
              >
                <PencilLine size={18} />
              </Button>
            )}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  title="Collaborate with others"
                  size="icon"
                  variant="success"
                >
                  <Share2 size={18} />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex gap-1 justify-center items-center">
                    Share your Code!
                  </DialogTitle>
                  <div className="__url flex justify-center items-center p-2 gap-2">
                    <input
                      type="text"
                      disabled
                      className="w-full p-2 rounded bg-slate-800 text-slate-400 select-none"
                      value={window.location.href}
                    />
                    <Button
                      title="Copy URL"
                      variant="success"
                      className="h-full"
                      onClick={() => {
                        window.navigator.clipboard.writeText(
                          window.location.href
                        );
                        toast("URL Copied to your clipboard!");
                      }}
                    >
                      <Copy size={18} />
                    </Button>
                  </div>
                  <p className="text-center text-slate-400 text-xs">
                    Share this URL with your friends and collaborate 😃
                  </p>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
      <div className="__tab_switcher flex justify-center items-center gap-1">
        <Select
          defaultValue={currentLanguage}
          onValueChange={(value) =>
            dispatch(
              updateCurrentLanguage(
                value as CompilerSliceStateType["currentLanguage"]
              )
            )
          }
        >
          <SelectTrigger className="w-[140px] bg-gray-800 outline-none focus:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="html">HTML</SelectItem>
            <SelectItem value="css">CSS</SelectItem>
            <SelectItem value="javascript">JavaScript</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
