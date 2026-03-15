import React from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

/**
 * Add your SF Symbols to Material Icons mappings here.
 */
const MAPPING = {
    // Tabs
    'house.fill': 'home',
    'paperplane.fill': 'send',
    // Auth & General
    'chevron.left': 'keyboard-arrow-left',
    'chevron.right': 'keyboard-arrow-right',
    'chevron.left.forwardslash.chevron.right': 'code',
    'person.fill': 'person',
    'shield.fill': 'security',
    'rectangle.portrait.and.arrow.right': 'logout',
    'g.circle.fill': 'email',
    'f.circle.fill': 'people',
    // Dashboard
    'exclamationmark.shield.fill': 'security',
    'doc.text.fill': 'description',
    'chart.bar.fill': 'bar-chart',
    'hand.raised.fill': 'pan-tool',
    'bell.fill': 'notifications',
    'lightbulb.fill': 'lightbulb-outline',
};

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 */
export function IconSymbol({
    name,
    size = 24,
    color,
    style,
}) {
    return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
