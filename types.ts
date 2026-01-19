export interface UserData {
  name: string;
  acceptedDisclaimer: boolean;
}

export enum AppState {
  INTRO = 'INTRO',
  FORM = 'FORM',
  SUBMITTING = 'SUBMITTING',
  SUCCESS = 'SUCCESS',
}
