import { Box, Button, CircularProgress, Typography } from "@mui/material";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type Func = () => void;

// Define the shape of our context state
interface LoadingContextState {
  loading: boolean;
  text: string;
  amount: number;
  cancelFunction: Func | null;
  toggleLoadingState: (func?: Func | null) => void;
  updateLoadingText: (text: string) => void;
  updateLoadingAmount: (amount: number) => void;
}

// Define the shape of our internal state
interface LoadingState {
  loading: boolean;
  text: string;
  amount: number;
  cancelFunction: Func | null;
}

// Create initial context state
const initialLoadingState: LoadingState = {
  loading: false,
  text: "Loading...",
  amount: 50,
  cancelFunction: null,
};

// Create the context with proper typing
const LoadingContext = createContext<LoadingContextState>({
  ...initialLoadingState,
  toggleLoadingState: () => {},
  updateLoadingText: () => {},
  updateLoadingAmount: () => {},
});

export const useLoadingState = (): LoadingContextState => {
  const context = useContext(LoadingContext);

  if (context === undefined) {
    throw new Error("useLoadingState must be used within a LoadingProvider");
  }

  return context;
};

function LoadingModel() {
  const { cancelFunction, loading, text, amount } = useLoadingState();
  const coverRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(300);

  useEffect(() => {
    if (!coverRef.current) return;

    //TODO: get width of the ref container
    setSize(Math.floor(coverRef.current.getBoundingClientRect().width * 0.8));
  }, []);

  return (
    <>
      {loading && (
        <Box
          ref={coverRef}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,20,0.6)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
              alignItems: "center",
              width: size,
              height: size * 1.2,
              color: "white",
              borderRadius: 2,
              backgroundColor: "rgba(70,70,70,1)",
            }}
          >
            <Typography variant="h6" component="h3">
              {text}
            </Typography>
            <CircularProgress size={size * 0.5} value={amount} />
            {cancelFunction != null && (
              <Button variant="contained" size="large" onClick={cancelFunction}>
                Cancel
              </Button>
            )}
          </Box>
        </Box>
      )}
    </>
  );
}

export default function LoadingProvider({ children }: { children: ReactNode }) {
  // Fix: Properly type the state with LoadingState interface
  const [state, setState] = useState<LoadingState>(initialLoadingState);

  const toggleLoadingState = (func: Func | null = null) => {
    setState((prevState) => ({
      ...prevState,
      loading: !prevState.loading,
      cancelFunction: func,
    }));
  };

  const updateLoadingText = (text: string) => {
    setState((prevState) => ({
      ...prevState,
      text,
    }));
  };

  const updateLoadingAmount = (amount: number) => {
    if (amount < 0 || amount > 100) return;
    setState((prevState) => ({
      ...prevState,
      amount,
    }));
  };

  const value: LoadingContextState = {
    ...state,
    toggleLoadingState,
    updateLoadingText,
    updateLoadingAmount,
  };

  return (
    <LoadingContext.Provider value={value}>
      <LoadingModel />
      {children}
    </LoadingContext.Provider>
  );
}
