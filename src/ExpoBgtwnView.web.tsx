import * as React from 'react';

import { ExpoBgtwnViewProps } from './ExpoBgtwn.types';

export default function ExpoBgtwnView(props: ExpoBgtwnViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
