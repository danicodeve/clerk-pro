import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const Loader = ({ className }: { className?: string }) => {
  return (
    <Loader2 className={cn("animate-spin text-muted-foreground", className)} />
  );
};

export default Loader;
