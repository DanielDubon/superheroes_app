import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';

export type BiometricAuthenticationError = {
  code: string;
  message?: string;
};

export interface Spec extends TurboModule {
  authenticate(
    onSuccess: () => void,
    onFailure: (e: BiometricAuthenticationError) => void
  ): void;
}


export default TurboModuleRegistry.getEnforcing<Spec>('BiometricAuth');
