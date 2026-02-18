export interface UserData {
  name: string;
  acceptedDisclaimer: boolean;
  token?: string;
  destinationUrl?: string; // The specific website this user is going to
  accessCode?: string;     // The password they used
}

export enum AppState {
  INTRO = 'INTRO',
  FORM = 'FORM',
  SUBMITTING = 'SUBMITTING',
  SUCCESS = 'SUCCESS',
}
