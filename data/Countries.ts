// data/Countries.ts

export interface Country {
    code: string
    name: string
    dialCode: string
}

/**
 * Genera la URL de la bandera usando FlagsAPI
 * Estilo: Shiny
 * Tamaño: 64px (optimizado para iconos pequeños)
 */
export const getFlagUrl = (code: string) =>
    `https://flagsapi.com/${code}/shiny/64.png`

// País por defecto (Chile)
export const defaultCountry: Country = { code: 'CL', name: 'Chile', dialCode: '+56' }

/**
 * Lista extensa de países
 */
export const countries: Country[] = [
    { code: 'AF', name: 'Afganistán', dialCode: '+93' },
    { code: 'AL', name: 'Albania', dialCode: '+355' },
    { code: 'DE', name: 'Alemania', dialCode: '+49' },
    { code: 'AD', name: 'Andorra', dialCode: '+376' },
    { code: 'AO', name: 'Angola', dialCode: '+244' },
    { code: 'SA', name: 'Arabia Saudita', dialCode: '+966' },
    { code: 'DZ', name: 'Argelia', dialCode: '+213' },
    { code: 'AR', name: 'Argentina', dialCode: '+54' },
    { code: 'AM', name: 'Armenia', dialCode: '+374' },
    { code: 'AU', name: 'Australia', dialCode: '+61' },
    { code: 'AT', name: 'Austria', dialCode: '+43' },
    { code: 'AZ', name: 'Azerbaiyán', dialCode: '+994' },
    { code: 'BD', name: 'Bangladesh', dialCode: '+880' },
    { code: 'BE', name: 'Bélgica', dialCode: '+32' },
    { code: 'BO', name: 'Bolivia', dialCode: '+591' },
    { code: 'BA', name: 'Bosnia y Herzegovina', dialCode: '+387' },
    { code: 'BR', name: 'Brasil', dialCode: '+55' },
    { code: 'BG', name: 'Bulgaria', dialCode: '+359' },
    { code: 'CA', name: 'Canadá', dialCode: '+1' },
    { code: 'CL', name: 'Chile', dialCode: '+56' },
    { code: 'CN', name: 'China', dialCode: '+86' },
    { code: 'CY', name: 'Chipre', dialCode: '+357' },
    { code: 'CO', name: 'Colombia', dialCode: '+57' },
    { code: 'KR', name: 'Corea del Sur', dialCode: '+82' },
    { code: 'CR', name: 'Costa Rica', dialCode: '+506' },
    { code: 'HR', name: 'Croacia', dialCode: '+385' },
    { code: 'CU', name: 'Cuba', dialCode: '+53' },
    { code: 'DK', name: 'Dinamarca', dialCode: '+45' },
    { code: 'EC', name: 'Ecuador', dialCode: '+593' },
    { code: 'EG', name: 'Egipto', dialCode: '+20' },
    { code: 'SV', name: 'El Salvador', dialCode: '+503' },
    { code: 'AE', name: 'Emiratos Árabes Unidos', dialCode: '+971' },
    { code: 'ES', name: 'España', dialCode: '+34' },
    { code: 'US', name: 'Estados Unidos', dialCode: '+1' },
    { code: 'EE', name: 'Estonia', dialCode: '+372' },
    { code: 'PH', name: 'Filipinas', dialCode: '+63' },
    { code: 'FI', name: 'Finlandia', dialCode: '+358' },
    { code: 'FR', name: 'Francia', dialCode: '+33' },
    { code: 'GR', name: 'Grecia', dialCode: '+30' },
    { code: 'GT', name: 'Guatemala', dialCode: '+502' },
    { code: 'HT', name: 'Haití', dialCode: '+509' },
    { code: 'HN', name: 'Honduras', dialCode: '+504' },
    { code: 'HK', name: 'Hong Kong', dialCode: '+852' },
    { code: 'HU', name: 'Hungría', dialCode: '+36' },
    { code: 'IN', name: 'India', dialCode: '+91' },
    { code: 'ID', name: 'Indonesia', dialCode: '+62' },
    { code: 'IQ', name: 'Irak', dialCode: '+964' },
    { code: 'IR', name: 'Irán', dialCode: '+98' },
    { code: 'IE', name: 'Irlanda', dialCode: '+353' },
    { code: 'IS', name: 'Islandia', dialCode: '+354' },
    { code: 'IL', name: 'Israel', dialCode: '+972' },
    { code: 'IT', name: 'Italia', dialCode: '+39' },
    { code: 'JM', name: 'Jamaica', dialCode: '+1' },
    { code: 'JP', name: 'Japón', dialCode: '+81' },
    { code: 'JO', name: 'Jordania', dialCode: '+962' },
    { code: 'KZ', name: 'Kazajistán', dialCode: '+7' },
    { code: 'KE', name: 'Kenia', dialCode: '+254' },
    { code: 'KW', name: 'Kuwait', dialCode: '+965' },
    { code: 'LV', name: 'Letonia', dialCode: '+371' },
    { code: 'LB', name: 'Líbano', dialCode: '+961' },
    { code: 'LY', name: 'Libia', dialCode: '+218' },
    { code: 'LT', name: 'Lituania', dialCode: '+370' },
    { code: 'LU', name: 'Luxemburgo', dialCode: '+352' },
    { code: 'MY', name: 'Malasia', dialCode: '+60' },
    { code: 'MA', name: 'Marruecos', dialCode: '+212' },
    { code: 'MX', name: 'México', dialCode: '+52' },
    { code: 'MC', name: 'Mónaco', dialCode: '+377' },
    { code: 'NG', name: 'Nigeria', dialCode: '+234' },
    { code: 'NO', name: 'Noruega', dialCode: '+47' },
    { code: 'NZ', name: 'Nueva Zelanda', dialCode: '+64' },
    { code: 'NL', name: 'Países Bajos', dialCode: '+31' },
    { code: 'PK', name: 'Pakistán', dialCode: '+92' },
    { code: 'PA', name: 'Panamá', dialCode: '+507' },
    { code: 'PY', name: 'Paraguay', dialCode: '+595' },
    { code: 'PE', name: 'Perú', dialCode: '+51' },
    { code: 'PL', name: 'Polonia', dialCode: '+48' },
    { code: 'PT', name: 'Portugal', dialCode: '+351' },
    { code: 'PR', name: 'Puerto Rico', dialCode: '+1' },
    { code: 'QA', name: 'Qatar', dialCode: '+974' },
    { code: 'GB', name: 'Reino Unido', dialCode: '+44' },
    { code: 'CZ', name: 'República Checa', dialCode: '+420' },
    { code: 'DO', name: 'República Dominicana', dialCode: '+1' },
    { code: 'RO', name: 'Rumania', dialCode: '+40' },
    { code: 'RU', name: 'Rusia', dialCode: '+7' },
    { code: 'SG', name: 'Singapur', dialCode: '+65' },
    { code: 'ZA', name: 'Sudáfrica', dialCode: '+27' },
    { code: 'SE', name: 'Suecia', dialCode: '+46' },
    { code: 'CH', name: 'Suiza', dialCode: '+41' },
    { code: 'TH', name: 'Tailandia', dialCode: '+66' },
    { code: 'TW', name: 'Taiwán', dialCode: '+886' },
    { code: 'TR', name: 'Turquía', dialCode: '+90' },
    { code: 'UA', name: 'Ucrania', dialCode: '+380' },
    { code: 'UY', name: 'Uruguay', dialCode: '+598' },
    { code: 'VE', name: 'Venezuela', dialCode: '+58' },
    { code: 'VN', name: 'Vietnam', dialCode: '+84' },
].sort((a, b) => a.name.localeCompare(b.name))
// Ordenados alfabéticamente para mejor UX