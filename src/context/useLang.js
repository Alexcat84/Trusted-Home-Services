import { useContext } from 'react';
import { LangContext } from './langContextInstance';

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}
