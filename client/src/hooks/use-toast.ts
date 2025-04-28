import { useState, useEffect, ReactNode } from "react";
import {
  Toast,
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast";

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 1000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function generateId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
      id: string;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      id: string;
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      id: string;
    };

type State = {
  toasts: ToasterToast[];
};

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.id ? { ...t, ...action.toast } : t
        ),
      };

    case actionTypes.DISMISS_TOAST: {
      const { id } = action;

      // Cancel previous timeout if it exists
      if (toastTimeouts.has(id)) {
        clearTimeout(toastTimeouts.get(id));
        toastTimeouts.delete(id);
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === id ? { ...t, open: false } : t
        ),
      };
    }

    case actionTypes.REMOVE_TOAST:
      if (toastTimeouts.has(action.id)) {
        clearTimeout(toastTimeouts.get(action.id));
        toastTimeouts.delete(action.id);
      }

      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.id),
      };

    default:
      return state;
  }
};

export const useToast = () => {
  const [state, setState] = useState<State>({ toasts: [] });
  const [handlers] = useState({
    toast: (props: Omit<ToasterToast, "id">) => {
      const id = generateId();
      const toast: ToasterToast = { ...props, id, open: true };
      setState((state) => reducer(state, { type: actionTypes.ADD_TOAST, toast }));
      return id;
    },
    update: (id: string, props: Partial<ToasterToast>) => {
      setState((state) => reducer(state, { type: actionTypes.UPDATE_TOAST, id, toast: props }));
    },
    dismiss: (id: string) => {
      setState((state) => reducer(state, { type: actionTypes.DISMISS_TOAST, id }));
    },
    remove: (id: string) => {
      setState((state) => reducer(state, { type: actionTypes.REMOVE_TOAST, id }));
    },
  });

  useEffect(() => {
    state.toasts.forEach((toast) => {
      if (toast.open) {
        const timeoutId = setTimeout(() => {
          handlers.dismiss(toast.id);
        }, 5000);

        toastTimeouts.set(toast.id, timeoutId);
      } else {
        const timeoutId = setTimeout(() => {
          handlers.remove(toast.id);
        }, TOAST_REMOVE_DELAY);

        toastTimeouts.set(toast.id, timeoutId);
      }
    });
  }, [state, handlers]);

  return {
    ...handlers,
    toasts: state.toasts,
  };
};

export type ToastActionType = "foreground" | "destructive" | "default";

export type ToastProps = {
  id?: string;
  title?: string;
  description?: ReactNode;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
};
