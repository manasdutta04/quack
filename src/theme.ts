import {Platform} from 'react-native';

export const colors = { ink: '#14161B', inkRaised: '#1C1F26', inkSoft: '#282C35', inkMuted: '#777D8C', paper: '#F5F3EF', paperRaised: '#FFFFFF', paperMuted: '#E8E5DF', white: '#FFFFFF', warm: '#F4B57A', warmBright: '#FFD2A3', coral: '#FF8E78', mint: '#8DE2C0', blue: '#8DA8FF', danger: '#FF8A86' };
export const fonts = { display: Platform.select({ios: 'Avenir Next', android: 'sans-serif-medium'}) ?? 'sans-serif', body: Platform.select({ios: 'Avenir Next', android: 'sans-serif'}) ?? 'sans-serif' };
export const spacing = { xs: 6, sm: 10, md: 16, lg: 24, xl: 32, xxl: 44 };
export const radius = { sm: 12, md: 18, lg: 26, pill: 999 };
export const shadow = { floating: { shadowColor: '#000000', shadowOpacity: 0.16, shadowRadius: 18, shadowOffset: {width: 0, height: 10}, elevation: 8 } };
