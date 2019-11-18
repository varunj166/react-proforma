import React from 'react';
import { ProformaBundle } from './types';
import { ProformaContext } from './ProformaContext';

export interface IProps {}

export function Debug(props: IProps): JSX.Element {
  const { values, errors, touched } = React.useContext<ProformaBundle<any>>(
    ProformaContext
  );

  return (
    <div
      className="react-proforma-debug"
      style={{
        margin: '20px 0',
        padding: '10px',
        border: '3px solid #2c3e50',
        borderRadius: '10px',
        boxShadow: '1px 1px 3px #7b7b80',
        backgroundColor: '#dedee3',
        maxWidth: '800px',
        fontFamily: 'Arial, Helvetica, sans-serif'
      }}
    >
      <h3
        style={{
          margin: '10px 0 15px 0',
          textShadow: '0.3px 0.3px #919191',
          color: '#2c3e50'
        }}
      >
        -- React-Proforma Debug --
      </h3>
      <div
        style={{
          border: '1px solid #2c3e50',
          borderRadius: '10px',
          marginBottom: '10px',
          padding: '10px 5px'
        }}
      >
        <h4 style={{ margin: '3px 0 5px 0' }}>Values</h4>
        <pre style={{ margin: '0', fontSize: '1.2rem' }}>
          {JSON.stringify(values, null, 2)}
        </pre>
      </div>
      <div
        style={{
          border: '1px solid #2c3e50',
          borderRadius: '10px',
          marginBottom: '10px',
          padding: '10px 5px'
        }}
      >
        <h4 style={{ margin: '3px 0 5px 0' }}>Errors</h4>
        <pre style={{ margin: '0', fontSize: '1.2rem' }}>
          {JSON.stringify(errors, null, 2)}
        </pre>
      </div>
      <div
        style={{
          border: '1px solid #2c3e50',
          borderRadius: '10px',
          marginBottom: '10px',
          padding: '10px 5px'
        }}
      >
        <h4 style={{ margin: '3px 0 5px 0' }}>Touched</h4>
        <pre style={{ margin: '0', fontSize: '1.2rem' }}>
          {JSON.stringify(touched, null, 2)}
        </pre>
      </div>
    </div>
  );
}
