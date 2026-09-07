/// <reference types="vite/client" />

interface GoogleCredentialResponse {
  credential: string;
  select_by?: string;
}

interface GoogleAccountsId {
  initialize(config: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
  }): void;
  renderButton(
    parent: HTMLElement,
    options: {
      theme?: string;
      size?: string;
      width?: string | number;
      text?: string;
    }
  ): void;
  prompt?: () => void;
}

interface GoogleAccounts {
  id: GoogleAccountsId;
}

interface Window {
  google?: {
    accounts: GoogleAccounts;
  };
}
