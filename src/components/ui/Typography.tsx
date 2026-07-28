import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { Colors } from '../../constant/colors';

export type TypographyWeight = 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold';

export type TypographyVariant =
  | 'h1'         // screen titles e.g. "The Galle Lodge"
  | 'h2'         // section headers e.g. "Available Room Types"
  | 'h3'         // card titles e.g. "5-Seat AC Room"
  | 'subtitle'   // secondary line under a title
  | 'body'       // default paragraph text
  | 'caption'    // small helper/meta text e.g. "60% filled"
  | 'button'     // button labels
  | 'stat'       // big stat numbers e.g. "12", "LKR 15K"
  | 'badge';     // pill/badge text e.g. "Apartment", "AC"

const FONT_WEIGHTS: Record<TypographyWeight, TextStyle['fontWeight']> = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
};

const VARIANT_STYLES: Record<TypographyVariant, TextStyle> = {
  h1: { fontSize: 26, fontWeight: FONT_WEIGHTS.bold, color: Colors.TEXT_PRIMARY },
  h2: { fontSize: 20, fontWeight: FONT_WEIGHTS.bold, color: Colors.TEXT_PRIMARY },
  h3: { fontSize: 16, fontWeight: FONT_WEIGHTS.semibold, color: Colors.TEXT_PRIMARY },
  subtitle: { fontSize: 14, fontWeight: FONT_WEIGHTS.medium, color: Colors.TEXT_PRIMARY },
  body: { fontSize: 14, fontWeight: FONT_WEIGHTS.regular, color: Colors.TEXT_PRIMARY },
  caption: { fontSize: 12, fontWeight: FONT_WEIGHTS.regular, color: Colors.TEXT_GRAY },
  button: { fontSize: 15, fontWeight: FONT_WEIGHTS.bold, color: Colors.WHITE },
  stat: { fontSize: 20, fontWeight: FONT_WEIGHTS.extrabold, color: Colors.TEXT_PRIMARY },
  badge: { fontSize: 12, fontWeight: FONT_WEIGHTS.semibold, color: Colors.PRIMARY_COLOR },
};

export interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  weight?: TypographyWeight;
  size?: number;
  children: React.ReactNode;
}

const Typography = ({
  variant = 'body', color, weight, size, style, children, ...rest
}: TypographyProps) => {
  const variantStyle = VARIANT_STYLES[variant];

  return (
    <Text
      style={[
        variantStyle,
        weight ? { fontWeight: FONT_WEIGHTS[weight] } : undefined,
        size !== undefined ? { fontSize: size } : undefined,
        color ? { color } : undefined,
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
};

export default Typography;
