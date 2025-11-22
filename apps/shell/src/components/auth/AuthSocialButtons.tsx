import * as React from 'react';
import { cn } from '@/lib/utils';

type Provider = {
  id: 'google' | 'facebook' | 'apple';
  label: string;
  icon: React.ReactNode;
};

const providers: Provider[] = [
  {
    id: 'google',
    label: 'Continue with Google',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M23.52 12.272c0-.815-.073-1.596-.209-2.344H12v4.436h6.516a5.58 5.58 0 01-2.417 3.662v3.046h3.914c2.29-2.109 3.507-5.215 3.507-8.8z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.957-1.075 7.943-2.923l-3.914-3.046c-1.09.73-2.487 1.163-4.029 1.163-3.096 0-5.717-2.09-6.652-4.897H1.338v3.086A11.997 11.997 0 0012 24z"
        />
        <path
          fill="#FBBC05"
          d="M5.348 14.297A7.214 7.214 0 014.97 12c0-.8.137-1.58.378-2.297V6.617H1.338A11.996 11.996 0 000 12c0 1.932.46 3.756 1.338 5.383l4.01-3.086z"
        />
        <path
          fill="#EA4335"
          d="M12 4.75a6.5 6.5 0 014.593 1.795l3.43-3.43C17.953.973 15.236 0 12 0 7.31 0 3.249 2.69 1.338 6.617l4.01 3.086C6.283 7.897 8.904 5.806 12 5.806z"
        />
      </svg>
    ),
  },
  {
    id: 'facebook',
    label: 'Continue with Facebook',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-[#1877F2]" aria-hidden="true">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.022 4.388 11.013 10.125 11.927v-8.438H7.078v-3.489h3.047V9.412c0-3.026 1.79-4.698 4.533-4.698 1.312 0 2.686.236 2.686.236v2.98h-1.514c-1.491 0-1.955.929-1.955 1.882v2.258h3.328l-.532 3.489h-2.796V24C19.612 23.086 24 18.095 24 12.073z" />
      </svg>
    ),
  },
  {
    id: 'apple',
    label: 'Continue with Apple',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 text-foreground" aria-hidden="true">
        <path
          fill="currentColor"
          d="M16.365 1.43c0 1.14-.446 2.007-1.334 2.69-.888.671-1.83 1.07-2.815 1.006-.068-.896.252-1.707.96-2.422.708-.715 1.56-1.156 2.544-1.274.11.01.208.035.3.061.153.051.255.149.345.24zm5.56 16.528c-.372.875-.812 1.68-1.318 2.416-.55.803-1.002 1.365-1.358 1.685-.541.493-1.12.742-1.736.75-.444.01-.979-.126-1.602-.4-.623-.274-1.196-.41-1.72-.41-.545 0-1.13.136-1.757.41-.629.275-1.136.418-1.524.429-.594.024-1.19-.232-1.79-.77-.381-.33-.852-.908-1.414-1.732-.606-.89-1.105-1.919-1.497-3.089-.418-1.29-.628-2.534-.628-3.732 0-1.379.298-2.58.894-3.604a5.35 5.35 0 012.29-2.216 6.03 6.03 0 012.92-.78c.57 0 1.315.157 2.233.472.92.315 1.51.474 1.77.474.195 0 .86-.206 1.997-.618 1.069-.378 1.973-.534 2.714-.47 2.004.162 3.51.96 4.516 2.4-1.8 1.091-2.696 2.62-2.696 4.581 0 1.528.577 2.796 1.73 3.808-.205.556-.419 1.079-.643 1.57z"
        />
      </svg>
    ),
  },
];

export interface AuthSocialButtonsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
}

export function AuthSocialButtons({
  disabled,
  className,
  ...props
}: AuthSocialButtonsProps) {
  return (
    <div className={cn('flex gap-3', className)} {...props}>
      {providers.map((provider) => (
        <button
          key={provider.id}
          type="button"
          disabled={disabled}
          aria-label={provider.label}
          className="inline-flex h-12 flex-1 items-center justify-center rounded-md border border-border bg-white text-muted-foreground transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white hover:bg-muted/60 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {provider.icon}
        </button>
      ))}
    </div>
  );
}

export default AuthSocialButtons;

