import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} className="rounded-[22px] border-white/40 dark:border-white/10 shadow-2xl">
            <div className="grid gap-2 items-center" style={{fontFamily:'-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif'}}>
              {title && <ToastTitle className="text-base font-semibold">{title}</ToastTitle>}
              <div className="flex items-center gap-2">
                <span className="inline-flex h-4 w-4 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500"></span>
                {description && (
                  <ToastDescription className="text-sm opacity-90">{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
