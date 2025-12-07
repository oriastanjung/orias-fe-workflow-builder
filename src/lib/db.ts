import Dexie from "dexie";

import type { Chat } from "@/types/chat";
import type { Message } from "@/types/message";

const db = new Dexie("oriasStudio") as Dexie & {
  chats: Dexie.Table<Chat, string>;
  messages: Dexie.Table<Message, string>;
};

db.version(1).stores({
  chats: "id, type, category, updatedAt",
  messages: "id, chatId, createdAt",
});

export default db;
