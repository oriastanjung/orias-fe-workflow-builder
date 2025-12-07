import React from "react";

import { CanceledError } from "axios";
import { ArrowUp, Loader, RefreshCcw, Paperclip, XCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axiosInstance from "@/lib/axios";
import { setLocalStorageItem } from "@/lib/storage";

type CustomFile = {
  file: File;
  id: string;
  status: string;
  url?: string;
  controller: AbortController;
};

type ChatFieldType = {
  direction?: string;
  chatId: string;
  placeholder?: string;
  isAI?: boolean;
  cacheSuffix?: string;
};

const ChatField = ({
  direction,
  chatId,
  placeholder,
  isAI = true,
  cacheSuffix,
}: ChatFieldType) => {
  // Hold internal states
  const [content, setContent] = React.useState<string>("");
  const [attachments, setAttachments] = React.useState<CustomFile[]>([]);

  const inputFileRef = React.useRef<HTMLInputElement>(null);
  const controllerRef = React.useRef<Record<string, AbortController>>({});

  // Upload file
  const uploadFile = React.useCallback(
    async (file: CustomFile) => {
      const formData = new FormData();

      formData.append("files", file.file);
      formData.append("parentFolder", `chat/${chatId}`);

      axiosInstance
        .post(`api/v1/app-tools/file`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          signal: file.controller.signal,
        })
        .then((res) => {
          // Update the state
          setAttachments((prev) =>
            prev.map((att) => ({
              ...att,
              ...(att.id === file.id
                ? {
                    status: "success",
                    url: res.data.data.urls[0],
                  }
                : {}),
            }))
          );

          // update the local storage
          const chat = JSON.parse(
            localStorage.getItem(`chat-${chatId}${cacheSuffix}`) || "{}"
          );
          const attachment = chat.attachments.find(
            (att: CustomFile) => file.id === att.id
          );
          if (attachment) {
            const url = attachment.url;
            const newChat = {
              ...chat,
              attachments: chat.attachments.map((att: CustomFile) => ({
                ...att,
                status: file.id === att.id ? "success" : att.status,
                url: res.data.data.urls[0],
              })),
            };
            localStorage.setItem(
              `chat-${chatId}${cacheSuffix}`,
              JSON.stringify(newChat)
            );

            // If there is still temporary url, revoke it
            if (url) {
              URL.revokeObjectURL(url);
            }
          }
        })
        .catch((error) => {
          if (error instanceof CanceledError) return;

          // Update the state
          setAttachments((prev) =>
            prev.map((att) => ({
              ...att,
              status: att.id === file.id ? "failed" : att.status,
            }))
          );

          // update the local storage
          const chat = JSON.parse(
            localStorage.getItem(`chat-${chatId}${cacheSuffix}`) || "{}"
          );
          const attachment = chat.attachments.find(
            (att: CustomFile) => file.id === att.id
          );
          if (attachment) {
            const newChat = {
              ...chat,
              attachments: chat.attachments.map((att: CustomFile) => ({
                ...att,
                status: att.id === file.id ? "failed" : att.status,
              })),
            };
            localStorage.setItem(
              `chat-${chatId}${cacheSuffix}`,
              JSON.stringify(newChat)
            );
          }
        });
    },
    [chatId]
  );

  // Send message
  const sendMessage = React.useCallback(() => {
    toast.promise(
      async () => {
        const context = attachments
          .filter((att) => att.status === "success")
          .map((att) => ({ type: att.file.type, content: att.url }));
        const response = await axiosInstance.post(
          "/api/v1/chat-tools/message",
          { content, context, chatId, direction }
        );
        return response.data.data;
      },
      {
        loading: "Sending message",
        success: () => {
          // On success, reset the field
          setContent("");
          setAttachments([]);
          isAI &&
            setLocalStorageItem(
              `chat-process-${chatId}`,
              JSON.stringify({ process: "Generating Image" })
            );
          return "Success sending message";
        },
        error: "An error occured",
      }
    );
  }, [chatId, content, attachments]);

  // Handle file paste text area event
  const onPaste: React.ClipboardEventHandler = React.useCallback(
    (e) => {
      if (e.clipboardData.files.length > 0) {
        e.preventDefault();
        e.stopPropagation();

        const newFiles = Array.from(e.clipboardData.files).map((file) => {
          const id = crypto.randomUUID();
          const controller = new AbortController();

          controllerRef.current = {
            ...controllerRef.current,
            [id]: controller,
          };

          return {
            file,
            id,
            status: "uploading",
            url: URL.createObjectURL(file),
            controller,
          };
        });
        setAttachments((prev) => [...prev, ...newFiles]);

        newFiles.forEach(uploadFile);
      }
    },
    [uploadFile]
  );

  // Handle file frop on text area event
  const onDrop: React.DragEventHandler = React.useCallback(
    async (e) => {
      if (e.dataTransfer.files.length > 0) {
        e.preventDefault();
        e.stopPropagation();

        const newFiles = Array.from(e.dataTransfer.files).map((file) => {
          const id = crypto.randomUUID();
          const controller = new AbortController();

          controllerRef.current = {
            ...controllerRef.current,
            [id]: controller,
          };

          return {
            file,
            id,
            status: "uploading",
            url: URL.createObjectURL(file),
            controller,
          };
        });

        setAttachments((prev) => [...prev, ...newFiles]);

        newFiles.forEach(uploadFile);
      }
    },
    [uploadFile]
  );

  // Handle file input change event
  const onFileChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const newFiles = Array.from(e.target.files).map((file) => {
          const id = crypto.randomUUID();
          const controller = new AbortController();

          controllerRef.current = {
            ...controllerRef.current,
            [id]: controller,
          };

          return {
            file,
            id,
            status: "uploading",
            url: URL.createObjectURL(file),
            controller,
          };
        });

        setAttachments((prev) => [...prev, ...newFiles]);

        newFiles.forEach(uploadFile);
      }
    },
    [uploadFile]
  );

  // Retry to reupload in case of failure
  const retry = React.useCallback(
    async (file: CustomFile) => {
      const newController = new AbortController();
      controllerRef.current = {
        ...controllerRef.current,
        [file.id]: newController,
      };
      setAttachments((prev) =>
        prev.map((att) => ({
          ...att,
          status: att.id === file.id ? "uploading" : att.status,
          controller: att.id === file.id ? newController : att.controller,
        }))
      );

      uploadFile(file);
    },
    [uploadFile]
  );

  // Delete file
  const deleteFile = React.useCallback(async (file: CustomFile) => {
    // Remove file from cache
    setAttachments((prev) => prev.filter((att) => att.id !== file.id));

    // TODO: find out how to remove controller from the ref

    // If temporary url still there, revoke it
    const attachment = attachments.find((att) => att.id === file.id);
    if (attachment && attachment.status !== "success" && attachment.url) {
      URL.revokeObjectURL(attachment.url);
    }

    // Abort fetch process
    file.controller.abort();

    // If file is already uploaded, remove it from the bucket
    if (file.status === "success") {
      axiosInstance.delete(`/api/v1/app-tools/file`, {
        data: { key: file.url?.split("/").slice(4).join("/") },
      });
    }
  }, []);

  // Sync content from local storage
  React.useEffect(() => {
    const data = localStorage.getItem(`chat-${chatId}${cacheSuffix}`);
    if (data) {
      const { content, attachments } = JSON.parse(data);
      setContent(content);
      setAttachments(
        attachments.map((att: CustomFile) => ({
          ...att,
          controller: controllerRef.current[att.id],
        }))
      );
    }

    // Clean up the field
    return () => {
      setContent("");
      setAttachments([]);
    };
  }, [chatId]);

  // Sync content to local storage
  React.useEffect(() => {
    if (content || attachments.length > 0) {
      localStorage.setItem(
        `chat-${chatId}${cacheSuffix}`,
        JSON.stringify({
          content,
          attachments: attachments.map((att) => ({
            ...att,
            file: {
              name: att.file.name,
              type: att.file.type,
              size: att.file.size,
              lastModified: att.file.lastModified,
              webkitRelativePath: att.file.webkitRelativePath,
            },
          })),
        })
      );
    } else {
      localStorage.removeItem(`chat-${chatId}${cacheSuffix}`);
    }
  }, [content, attachments]);

  return (
    <div className="sticky bottom-0 left-0">
      <Textarea
        value={content}
        onDrop={onDrop}
        onChange={(e) => setContent(e.target.value)}
        onPaste={onPaste}
        className={`rounded-[24px] field-sizing-content min-h-24 p-4 bg-white ${
          attachments.length > 0 && "pb-[132px]"
        }`}
        placeholder={
          placeholder || "Jelasin ke orias kamu mau buat desain untuk apa..."
        }
      />
      <div
        className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto"
        onDrop={onDrop}
      >
        {attachments.length > 0 &&
          attachments.map((att) => (
            <div
              className="aspect-square relative rounded-lg w-[100px] min-w-[100px] bg-neutral-100 overflow-wrap flex items-center justify-center wrap-anywhere"
              style={{
                backgroundImage: att.file.type.startsWith("image/")
                  ? `url(${att.url})`
                  : "unset",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {!att.file.type.startsWith("image/") && (
                <p className="text-xs">{att.file.name}</p>
              )}
              {att.status === "uploading" && (
                <div className="absolute rounded-lg top-0 left-0 w-full h-full flex items-center justify-center bg-black/50">
                  <Loader color="white" className="animate-spin" />
                </div>
              )}
              {att.status === "failed" && (
                <div className="absolute rounded-lg top-0 left-0 w-full h-full flex items-center justify-center bg-black/50">
                  <Button size="icon" onClick={() => retry(att)}>
                    <RefreshCcw />
                  </Button>
                </div>
              )}
              <XCircle
                onClick={() => deleteFile(att)}
                size={14}
                className="absolute top-1 right-1 cursor-pointer"
                color="white"
              />
            </div>
          ))}
      </div>
      <div className="flex gap-2 absolute right-2 bottom-2 ">
        <input
          type="file"
          className="hidden"
          multiple
          ref={inputFileRef}
          onChange={onFileChange}
        />
        <Button
          onClick={() => inputFileRef.current?.click()}
          size="icon"
          variant="ghost"
          className="rounded-full cursor-pointer"
        >
          <Paperclip />
        </Button>
        <Button
          disabled={!attachments.every((att) => att.status === "success")}
          onClick={sendMessage}
          size="icon"
          className="rounded-full text-black bg-brand-green hover:bg-brand-green/90 border border-black shadow-[2px_2px_0px_0px_#000000] cursor-pointer"
        >
          <ArrowUp />
        </Button>
      </div>
    </div>
  );
};

export default ChatField;
