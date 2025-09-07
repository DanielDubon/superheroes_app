import {Platform} from 'react-native';
import NativeBiometricAuth from '../../specs/NativeBiometricAuth';

export async function verifyBiometric(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await NativeBiometricAuth.authenticate();
}