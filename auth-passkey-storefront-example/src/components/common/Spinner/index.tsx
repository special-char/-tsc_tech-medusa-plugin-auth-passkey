import { cn } from "lib/utils"

const Spinner = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "block border-2 border-current border-l-transparent rounded-full w-5 aspect-square animate-spin",
        className
      )}
    ></div>
  )
}

export default Spinner
