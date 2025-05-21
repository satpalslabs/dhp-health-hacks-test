import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import InputTooltip from "@/components/ui/input-info-tooltip";
import InfoCircled from "@/info-circled.svg";
import { Pencil, Trash2, Upload } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { commonProps } from ".";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import formatBytes from "@/lib/format-bytes";
import { Skeleton } from "@/components/ui/skeleton";
import { uploadFiles } from "@/lib/services/upload-services";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

interface DropZonePropsType extends commonProps {
  dropZoneString?: string;
}
export const FileDropZone = ({
  control,
  name,
  label,
  tooltip,
  fieldValue,
  required = false,
  accept = {
    "image/png": [".png"],
    "image/webp": [".webp"],
    "image/jpeg": [".jpg", ".jpeg"],
  },
  maxSize = 5242880,
  dropZoneString,
}: DropZonePropsType) => {
  const defaultValues = {
    url: "",
    mime: "",
    name: "",
    size: "",
    height: 0,
    width: 0,
  };

  const [preview, setPreview] = useState(
    fieldValue ? fieldValue : defaultValues
  );
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (fieldValue) {
      setPreview(fieldValue);
    } else {
      setPreview(defaultValues);
    }
  }, [fieldValue, name, control]);
  // ✅ Use a ref to store field.onChange
  const fieldOnChangeRef =
    useRef<
      (value: {
        url: string;
        mime: string;
        name: string;
        size: number;
        width: number;
        height: number;
      }) => void
    >();

  // ✅ Define onDrop at the top level
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setLoading(true);
        const file = acceptedFiles[0];
        setLoading(true);
        const url = URL.createObjectURL(file);

        try {
          // 👇 Await upload and handle error
          const metadata = await uploadFiles(acceptedFiles);
          setLoading(false);
          // 👇 Determine if it's an image or video and extract metadata
          if (JSON.stringify(accept).includes("image")) {
            const img = new window.Image();
            img.src = url;

            img.onload = () => {
              setPreview(metadata[0]);
              fieldOnChangeRef.current?.(metadata[0]);
              setLoading(false);
            };
            toast({
              title: "Image Uploaded Successfully",
              variant: "default",
            });
          } else {
            const video = document.createElement("video");
            video.src = url;

            setPreview(metadata[0]);
            fieldOnChangeRef.current?.(metadata[0]);
            setLoading(false);
            toast({
              title: "Video Uploaded Successfully",
              variant: "default",
            });
          }
        } catch (error) {
          toast({
            title: "Upload failed",
            description: "Please try again.",
            variant: "destructive",
            action: (
              <ToastAction
                altText="done"
                onClick={() => {
                  setLoading(true);
                  onDrop(acceptedFiles);
                }}
              >
                Retry
              </ToastAction>
            ),
          });
          console.error("Upload failed:", error);
          setLoading(false);
          // Optional: show a toast or error UI
        }
      }
    },
    [accept, name, control]
  );

  // ✅ Call useDropzone at the top level
  const { getRootProps, getInputProps, inputRef } = useDropzone({
    onDrop,
    accept,
    maxSize, // 5MB limit
  });

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // ✅ Store field.onChange in the ref
        fieldOnChangeRef.current = field.onChange;
        return (
          <FormItem>
            {label && (
              <FormLabel className="flex gap-[2px] mt-[2px] text-sm font-inter items-center leading-[14px] [&_svg]:size-3">
                <span dangerouslySetInnerHTML={{ __html: label }} />
                {required && <span className="text-[red]">*</span>}
                <InputTooltip tooltip={tooltip}>
                  <InfoCircled />
                </InputTooltip>
              </FormLabel>
            )}
            {loading ? (
              <div
                className={`flex justify-between items-center p-[10px] mt-2 border rounded-lg animate-pulse`}
              >
                <div className="flex gap-2 items-center">
                  <Skeleton className="w-[120px] h-[75px] rounded-lg " />
                  <div className="flex flex-col gap-1">
                    <Skeleton className="w-[40px] h-6 rounded-lg " />
                    <Skeleton className="w-[80px] h-6 rounded-lg " />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="w-6 h-6 rounded-lg " />
                  <Skeleton className="w-6 h-6 rounded-lg " />
                </div>
              </div>
            ) : field.value ? (
              <div
                className={`flex justify-between items-center p-[10px] mt-2 gap-2 border rounded-lg `}
              >
                {preview.url && (
                  <>
                    {JSON.stringify(accept).includes("image") ? (
                      <Image
                        src={field.value.url}
                        alt="Preview"
                        height={400}
                        width={400}
                        className="w-[120px] h-[75px] object-cover rounded-lg bg-primary"
                      />
                    ) : (
                      <video
                        height={400}
                        width={400}
                        className="w-[120px] h-[75px] object-cover rounded-lg "
                      >
                        <source src={preview.url} />
                      </video>
                    )}
                  </>
                )}
                <div className="flex flex-col gap-1 grow">
                  <span className="text-sm font-inter">{preview.name}</span>
                  <span className="font-inter text-sm">
                    Size: {preview.width} x {preview.height}
                    <span className="text-button-filter-text px-2">.</span>
                    {preview.mime?.replace("image/", "")}
                    <span className="text-button-filter-text px-2">.</span>
                    {formatBytes(preview.size)}
                  </span>
                </div>
                <div className="flex items-center gap-2 [&_svg]:size-4 text-button-filter-text">
                  <button
                    type="button"
                    className="p-2"
                    onClick={() => {
                      inputRef.current?.click();
                    }}
                  >
                    <Pencil />
                  </button>
                  <button
                    type="button"
                    className="p-2"
                    onClick={() => {
                      field.onChange(null);
                    }}
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>
            ) : (
              <FormControl
                className={`${
                  field.value
                    ? "opacity-0 !max-h-0 !h-0 !min-h-0 !p-0 [&_div]:!min-h-0 overflow-hidden"
                    : "opacity-100"
                }`}
              >
                <div
                  {...getRootProps()}
                  className="flex flex-col min-h-[100px] items-center p-5 border-2 border-border font-inter text-sm rounded-lg cursor-pointer text-button-filter-text mt-2"
                >
                  <input {...getInputProps()} />
                  <Upload className="w-6 h-6" />
                  <div className="text-center mt-3">
                    {dropZoneString ? (
                      dropZoneString
                    ) : (
                      <>
                        <p>Upload or Drop a file</p>
                        {name == "cover_image" && (
                          <p>Max: 48x48px | JPG, PNG | Up to 5MB</p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </FormControl>
            )}
            <FormMessage className="font-inter text-sm" />
          </FormItem>
        );
      }}
    />
  );
};
