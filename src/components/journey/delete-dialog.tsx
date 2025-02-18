import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { TriangleAlert } from "lucide-react";
import { Button } from "../ui/button";

const DeleteDialog = ({
  open,
  setOpen,
  handleDelete,
  resourceName,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleDelete: () => void;
  resourceName: string;
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="font-inter w-[458px] flex flex-col gap-4">
        <DialogHeader>
          <DialogTitle className="text-[red] font-semibold items-center flex gap-2 text-lg font-inter">
            <TriangleAlert className="w-6 h-6" />
            <div>Delete {resourceName}?</div>
          </DialogTitle>
          <DialogDescription className="text-sm text-inherit !mt-3">
            Are you sure you want to delete this {resourceName}? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end">
          <Button
            variant="destructive"
            className="bg-[red]"
            onClick={handleDelete}
          >
            Delete
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
