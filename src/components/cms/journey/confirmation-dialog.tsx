import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button, SpinnerButton } from "@/components/ui/button";

const ActionConfirmationDialog = ({
  open,
  setOpen,
  handleAction = () => {},
  dialog_title,
  variant = "destructive",
  dialog_description,
  icon,
  action,
  showLoader = false,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  handleAction?: () => void;
  dialog_title: string;
  variant?: "destructive" | "secondary";
  dialog_description: string;
  icon: React.ReactNode;
  action?: "Delete" | "Publish" | "Unpublish";
  showLoader?: boolean;
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="font-inter w-[458px] flex flex-col gap-4">
        <DialogHeader>
          <DialogTitle
            className={`[&_svg]:size-6 ${
              variant == "destructive" ? "text-destructive" : "text-primary"
            } font-semibold items-center flex gap-2 text-lg font-inter`}
          >
            {icon}
            <div>{dialog_title}</div>
          </DialogTitle>
          <DialogDescription
            className="text-sm text-inherit !mt-3"
            dangerouslySetInnerHTML={{ __html: dialog_description }}
          />
        </DialogHeader>
        <DialogFooter className="flex justify-end">
          {action && (
            <SpinnerButton
              variant={variant == "destructive" ? variant : "default"}
              loading={showLoader}
              className={` ${
                variant == "destructive" ? "bg-[red]" : "bg-primary"
              }`}
              onClick={handleAction}
            >
              {action}
            </SpinnerButton>
          )}
          <Button
            variant="secondary"
            onClick={() => {
              setOpen(false);
            }}
          >
            {action ? "Cancel" : "Got it"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ActionConfirmationDialog;
