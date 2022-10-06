import React, {useState} from 'react';

export const useSyncState = initialValue => {
  const [value, setValue] = useState(initialValue);
  const setter = x =>
    new Promise() <
    any >
    (resolve => {
      setValue(x);
      resolve(x);
    });
  return [value, setter];
};
