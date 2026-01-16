import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 ring-offset-background active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-brand-primary to-brand-primary/90 text-white shadow-md hover:shadow-lg hover:shadow-brand-primary/25 hover:from-brand-primary hover:to-brand-secondary/80',
        destructive:
          'bg-gradient-to-r from-destructive to-destructive/90 text-destructive-foreground shadow-md hover:shadow-lg hover:shadow-destructive/25',
        secondary:
          'bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground shadow-md hover:shadow-lg hover:shadow-secondary/25',
        success:
          'bg-gradient-to-r from-success to-success/90 text-white shadow-md hover:shadow-lg hover:shadow-success/25',
        ghost:
          'hover:bg-muted hover:text-foreground hover:shadow-sm',
        outline:
          'border-2 border-input bg-background hover:bg-muted hover:text-foreground hover:border-primary/50',
        subtle:
          'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80',
        glass:
          'bg-white/70 backdrop-blur-md border border-white/20 shadow-glass hover:bg-white/80 hover:shadow-glass-lg text-foreground',
        link:
          'text-primary underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-9 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-xl px-8 text-base font-semibold',
        xl: 'h-14 rounded-xl px-10 text-lg font-semibold',
        icon: 'h-10 w-10 rounded-xl',
        'icon-sm': 'h-8 w-8 rounded-lg',
        'icon-lg': 'h-12 w-12 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)
