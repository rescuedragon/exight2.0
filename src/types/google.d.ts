// Google Identity Services TypeScript declarations

interface GoogleAccounts {
  id: {
    initialize: (config: {
      client_id: string;
      callback: (response: { credential: string }) => void;
      auto_select?: boolean;
      cancel_on_tap_outside?: boolean;
    }) => void;
    prompt: (callback?: (notification: any) => void) => void;
    renderButton: (element: HTMLElement, config: any) => void;
  };
  oauth2: {
    initTokenClient: (config: {
      client_id: string;
      scope: string;
      callback: (response: { access_token: string }) => void;
    }) => {
      requestAccessToken: () => void;
    };
  };
}

interface Window {
  google: {
    accounts: GoogleAccounts;
  };
}
