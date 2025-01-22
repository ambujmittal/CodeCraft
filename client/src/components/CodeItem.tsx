import { Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { codeType } from "@/vite-env";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { handleError } from "@/utils/handleError";
import { useDeleteCodeMutation } from "@/redux/slices/api";

export default function CodeItem({
  data,
  deleteBtn,
}: {
  data: codeType;
  deleteBtn: boolean;
}) {
  const [deleteCode, { isLoading }] = useDeleteCodeMutation();
  const handleDelete = async () => {
    try {
      const response = await deleteCode(data._id!).unwrap();
      console.log(response);
    } catch (error) {
      handleError(error);
    }
  };
  return (
    <div className="p-4 rounded-lg bg-slate-900 shadow-md flex flex-col items-center gap-4">
      <div className="w-full flex flex-col items-center gap-1">
        <p className="text-lg font-bold text-white truncate">{data.title}</p>
        {!deleteBtn && (
          <p className="text-sm text-gray-400">by {data.ownerName}</p>
        )}
      </div>
      <Separator className="w-full border-gray-700" />
      <div className="flex gap-4">
        <Link target="_blank" to={`/compiler/${data._id}`}>
          <Button
            variant="secondary"
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            {deleteBtn ? "Edit" : "Open Project"}
          </Button>
        </Link>

        {deleteBtn && (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Delete
              </Button>
            </DialogTrigger>

            <DialogContent className="p-6 bg-slate-800 rounded-lg shadow-lg text-white">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Trash2 className="text-red-500" />
                  Delete Confirmation
                </DialogTitle>
                <p className="text-sm text-gray-400 mt-2">
                  Are you sure you want to delete this code? This action cannot
                  be undone.
                </p>
              </DialogHeader>

              <div className="mt-4 flex justify-center">
                <Button
                  variant="destructive"
                  className="px-6 py-2 text-sm bg-red-600 hover:bg-red-700 rounded-lg"
                  onClick={handleDelete}
                  loading={isLoading}
                >
                  Confirm Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
