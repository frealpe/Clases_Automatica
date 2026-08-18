import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

/**
 * Hook personalizado para garantizar la integridad anti-trampa y anti-IA en las evaluaciones.
 * @param {boolean} examenActivo Indica si el examen se está ejecutando en este momento.
 * @param {function} onInfraccion Callback ejecutado cuando se detecta una posible infracción,
 *   recibe {tipo, ts} — mismo shape que usa el backend (infracciones JSONB) y el modo programado
 *   de la web, para que el registro sea consistente entre plataformas.
 */
export function useExamSecurity(examenActivo, onInfraccion) {
  const [capturaBloqueada, setCapturaBloqueada] = useState(false);
  const [infraccionDetectada, setInfraccionDetectada] = useState(false);

  const emitirInfraccion = (tipo) => {
    if (onInfraccion) onInfraccion({ tipo, ts: new Date().toISOString() });
  };

  useEffect(() => {
    let isMounted = true;
    let subscription = null;

    async function activarSeguridad() {
      if (!examenActivo) return;

      // 1. Intentar bloquear capturas de pantalla si expo-screen-capture está disponible
      try {
        const ScreenCapture = require('expo-screen-capture');
        if (ScreenCapture && ScreenCapture.preventScreenCaptureAsync) {
          await ScreenCapture.preventScreenCaptureAsync();
          if (isMounted) setCapturaBloqueada(true);
        }
      } catch (err) {
        console.log('ScreenCapture prevention unavailable in web or simulation:', err?.message);
        if (isMounted) setCapturaBloqueada(true); // Fallback visual
      }

      // 2. Evitar que la pantalla se apague durante el examen (no reemplaza un bloqueo real,
      // pero evita que el celular se duerma a mitad de la prueba).
      try {
        const KeepAwake = require('expo-keep-awake');
        if (KeepAwake && KeepAwake.activateKeepAwakeAsync) {
          await KeepAwake.activateKeepAwakeAsync('examen-programado');
        }
      } catch (err) {
        console.log('KeepAwake no disponible:', err?.message);
      }

      // 3. Fijar la orientación en vertical durante el examen (evita distracciones al rotar).
      try {
        const ScreenOrientation = require('expo-screen-orientation');
        if (ScreenOrientation && ScreenOrientation.lockAsync) {
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        }
      } catch (err) {
        console.log('ScreenOrientation no disponible:', err?.message);
      }

      // 4. Listener de AppState para detectar salida a otras aplicaciones (evitar IA / ChatGPT).
      // Reactivo, no bloquea la salida física — igual que el equivalente en la versión web
      // (visibilitychange/blur), documentado como limitación conocida.
      subscription = AppState.addEventListener('change', (nextAppState) => {
        if (nextAppState === 'background' || nextAppState === 'inactive') {
          console.warn('SEGURIDAD ALERTA: La aplicación se minimizó o perdió el foco durante el examen.');
          if (isMounted) setInfraccionDetectada(true);
          emitirInfraccion(nextAppState === 'background' ? 'background' : 'inactive');
        }
      });
    }

    activarSeguridad();

    return () => {
      isMounted = false;
      if (subscription) {
        subscription.remove();
      }
      // Desbloquear capturas, keep-awake y orientación al terminar el examen.
      try {
        const ScreenCapture = require('expo-screen-capture');
        if (ScreenCapture && ScreenCapture.allowScreenCaptureAsync) {
          ScreenCapture.allowScreenCaptureAsync();
        }
      } catch (err) {
        // Ignorar error al limpiar
      }
      try {
        const KeepAwake = require('expo-keep-awake');
        if (KeepAwake && KeepAwake.deactivateKeepAwake) {
          KeepAwake.deactivateKeepAwake('examen-programado');
        }
      } catch (err) {
        // Ignorar error al limpiar
      }
      try {
        const ScreenOrientation = require('expo-screen-orientation');
        if (ScreenOrientation && ScreenOrientation.unlockAsync) {
          ScreenOrientation.unlockAsync();
        }
      } catch (err) {
        // Ignorar error al limpiar
      }
    };
  }, [examenActivo]);

  return {
    capturaBloqueada,
    infraccionDetectada
  };
}
