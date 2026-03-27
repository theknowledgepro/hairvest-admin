import * as React from "react"
// Assuming radix-ui is a meta package or we should just use a simple implementation if unsure about sub-packages
// Actually, let's use a standard functional implementation for simplicity and reliability if Radix isn't clearly partitioned
import { cn } from "@/lib/utils"

const Tabs = ({ children, defaultValue, className, ...props }: any) => {
  const [value, setValue] = React.useState(defaultValue)
  return (
    <div className={cn("w-full", className)} {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { value, setValue })
        }
        return child
      })}
    </div>
  )
}

const TabsList = ({ children, className, value, setValue, ...props }: any) => {
  return (
    <div
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-neutral-900/50 p-1 text-neutral-400 border border-neutral-800",
        className
      )}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { activeValue: value, setValue })
        }
        return child
      })}
    </div>
  )
}

const TabsTrigger = ({ children, value, activeValue, setValue, className, ...props }: any) => {
  const isActive = value === activeValue
  return (
    <button
      onClick={() => setValue(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        isActive 
          ? "bg-neutral-800 text-white shadow-sm" 
          : "hover:text-neutral-200",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

const TabsContent = ({ children, value, activeValue, className, ...props }: any) => {
  if (value !== activeValue) return null
  return (
    <div
      className={cn(
        "mt-2 ring-offset-white focus-visible:outline-none",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
