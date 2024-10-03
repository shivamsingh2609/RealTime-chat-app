import { createAuthSlice } from "./slices/auth-slice";
import { create } from "zustand";
import { createChatslice } from "./slices/chat_slice";
export const useAppStore  = create()((...a)=>({
    ...createAuthSlice(...a),
    ...createChatslice(...a),
}));