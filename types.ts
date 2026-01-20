export interface UserData {
  name: string;
  acceptedDisclaimer: boolean;
  token?: string;
}

export enum AppState {
  INTRO = 'INTRO',
  FORM = 'FORM',
  SUBMITTING = 'SUBMITTING',
  SUCCESS = 'SUCCESS',
}
