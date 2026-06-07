/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import * as Icons from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
  size?: number;
}

export default function CategoryIcon({ name, className = '', size = 24 }: CategoryIconProps) {
  // Resolve icon component dynamically from name string
  // Default to HelpCircle if not found
  const IconComponent = (Icons as any)[name] || Icons.CircleHelp;

  return React.createElement(IconComponent, { className, size });
}
