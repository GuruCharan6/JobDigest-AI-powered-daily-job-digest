import toast from 'react-hot-toast'

const baseClassName = 'font-sans text-sm font-medium rounded-lg px-4 py-3'

export const showToast = {
  success: (msg: string) =>
    toast.success(msg, {
      className: `${baseClassName} text-emerald-400 bg-card border border-emerald-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)]`,
    }),

  error: (msg: string) =>
    toast.error(msg, {
      className: `${baseClassName} text-red-400 bg-card border border-red-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)]`,
    }),

  loading: (msg: string) =>
    toast.loading(msg, {
      className: `${baseClassName} text-muted-foreground bg-card border border-border shadow-[0_8px_32px_rgba(0,0,0,0.4)]`,
    }),

  dismiss: toast.dismiss,
}
