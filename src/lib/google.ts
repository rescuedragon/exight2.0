/*
  Lightweight loader for Google Identity Services (GIS).
  Provides helpers to render the official "Continue with Google" button and
  obtain an ID token (JWT) that can be sent to the backend for verification.
*/

type GoogleIdentity = {
  accounts?: {
    id?: {
      initialize?: (opts: unknown) => void;
      renderButton?: (el: HTMLElement, opts: Record<string, unknown>) => void;
      prompt?: () => void;
    };
  };
};

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(s);
  });
}

export async function renderGoogleButton(
  clientId: string,
  mountEl: HTMLElement,
  onCredential: (idToken: string) => void,
) {
  await loadScript('https://accounts.google.com/gsi/client');
  const g = (window as unknown as { google?: GoogleIdentity }).google;
  if (!g?.accounts?.id) throw new Error('Google Identity not available');

  g.accounts.id.initialize?.({
    client_id: clientId,
    callback: (response: { credential?: string }) => {
      if (response?.credential) onCredential(response.credential);
    },
    auto_select: false,
    cancel_on_tap_outside: true,
    ux_mode: 'popup',
  });

  g.accounts.id.renderButton?.(mountEl, {
    theme: 'outline',
    size: 'large',
    shape: 'pill',
    text: 'continue_with',
    logo_alignment: 'left',
    width: 320,
  });
}

export async function promptOneTap(clientId: string, onCredential: (idToken: string) => void) {
  await loadScript('https://accounts.google.com/gsi/client');
  const g = (window as unknown as { google?: GoogleIdentity }).google;
  if (!g?.accounts?.id) throw new Error('Google Identity not available');
  g.accounts.id.initialize?.({
    client_id: clientId,
    callback: (response: { credential?: string }) => {
      if (response?.credential) onCredential(response.credential);
    },
  });
  g.accounts.id.prompt?.();
}
