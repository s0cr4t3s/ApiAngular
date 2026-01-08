import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

// blue, indigo, purple, pink, red, orange, amber, yellow, teal, cyan, green, emerald, lime, slate, gray, zinc, neutral, stone.
const MyPreset = definePreset(Aura, {
	semantic: {
		primary: {
			// This replaces "Teal" with "Blue"
			50: '{blue.50}',
			100: '{blue.100}',
			200: '{blue.200}',
			300: '{blue.300}',
			400: '{blue.400}',
			500: '{blue.500}',
			600: '{blue.600}',
			700: '{blue.700}',
			800: '{blue.800}',
			900: '{blue.900}',
			950: '{blue.950}'
		}
	}
});

const NoirPreset = definePreset(Aura, {
	semantic: {
		primary: {
			50: '{zinc.50}',
			100: '{zinc.100}',
			200: '{zinc.200}',
			300: '{zinc.300}',
			400: '{zinc.400}',
			500: '{zinc.500}',
			600: '{zinc.600}',
			700: '{zinc.700}',
			800: '{zinc.800}',
			900: '{zinc.900}',
			950: '{zinc.950}'
		},
		colorScheme: {
			light: {
				primary: {
					color: '{zinc.950}',
					contrastColor: '#ffffff',
					hoverColor: '{zinc.800}',
					activeColor: '{zinc.700}'
				}
			},
			dark: {
				primary: {
					color: '{zinc.50}',
					contrastColor: '{zinc.950}',
					hoverColor: '{zinc.200}',
					activeColor: '{zinc.300}'
				}
			}
		}
	}
});

export const DefaultBlueTheme = definePreset(Aura, {
	semantic: {
		primary: {
			// Using the Royal Blue from the SIBS "Continuar" button
			50: '#f5f7ff',
			100: '#ebf0fe',
			200: '#ced9fd',
			300: '#adc0fb',
			400: '#8ca6f9',
			500: '#4c6ef5',	// primary.color
			600: '#4361d8',	// primary.hover.color
			700: '#3851b5',	// primary.active.color
			800: '#2d4192',
			900: '#253577',
			950: '#171344'
		},
		colorScheme: {
			light: {
				surface: {
					0: '#ffffff',		// surface.section, surface.card, surface.overlay
					50: '#f8fafc',		// surface.ground
					100: '#f1f5f9',	// surface.hover
					200: '#e2e8f0',	// surface.border
					300: '#cbd5e1',
					400: '#94a3b8',
					500: '#64748b',
					600: '#475569',
					700: '#334155',
					800: '#1e293b',
					900: '#0f172a',
					950: '#020617'
				},
				primary: {
					color: '{primary.500}',
					contrastColor: '#ffffff',
					hoverColor: '{primary.600}',
					activeColor: '{primary.700}'
				}
			},
			dark: {
				surface: {
					// Deep Zinc palette for the Noir look you liked
					0: '#ffffff',
					50: '{zinc.50}',
					100: '{zinc.100}',
					200: '{zinc.200}',
					300: '{zinc.300}',
					400: '{zinc.400}',
					500: '{zinc.500}',
					600: '{zinc.600}',
					700: '{zinc.700}',
					800: '{zinc.800}',
					900: '{zinc.900}',
					950: '{zinc.950}'
				},
				primary: {
					color: '{primary.500}', // Brighter blue for dark mode visibility
					contrastColor: '#ffffff',
					hoverColor: '{primary.300}',
					activeColor: '{primary.200}'
				}
			}
		}
	},
	//components: {
	//	button: {
	//		root: {
	//			paddingY: '20px',
	//			paddingX: '20px'
	//		}
	//	}
	//}
});
