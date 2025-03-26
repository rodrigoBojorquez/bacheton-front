// primeuix-theme.d.ts

export interface PrimeUixTheme {
  semantic?: {
    primary?: Partial<Record<string, string>>; // Ahora se permite que falten propiedades
    colorScheme?: {
      light?: {
        primary?: {
          color?: string;
          contrastColor?: string;
          hoverColor?: string;
          activeColor?: string;
        };
        highlight?: {
          background?: string;
          focusBackground?: string;
          color?: string;
          focusColor?: string;
        };
      };
      dark?: {
        primary?: {
          color?: string;
          contrastColor?: string;
          hoverColor?: string;
          activeColor?: string;
        };
        highlight?: {
          background?: string;
          focusBackground?: string;
          color?: string;
          focusColor?: string;
        };
      };
    };
  };
  // Otras propiedades que tu tema pueda tener...
}
