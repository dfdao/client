import React, { useState } from 'react';
import styled from 'styled-components';
import { Btn } from '../../Components/Btn';
import {
    Checkbox,
    DarkForestCheckbox,
    DarkForestTextInput,
    TextInput
} from '../../Components/Input';
import { Row } from '../../Components/Row';
import { Sub } from '../../Components/Text';
import { Table } from '../../Views/Table';
import { LobbiesPaneProps, Warning } from './LobbiesUtils';

const TableContainer = styled.div`
  overflow-y: scroll;
  width: 100%;
`;

const jcFlexEnd = { display: 'flex', justifyContent: 'flex-end' } as CSSStyleDeclaration &
  React.CSSProperties;
  const jcSpaceEvenly = { display: 'flex', justifyContent: 'space-evenly' } as CSSStyleDeclaration &
  React.CSSProperties;


const defaultAddress = '0x0000000000000000000000000000000000000000';
export function WhitelistPane({ config: config, onUpdate: onUpdate }: LobbiesPaneProps) {
  const [address, setAddress] = useState<string>(defaultAddress);
  const [stagedAddresses, setStagedAddresses] = useState<string[]>([]);
  const [createdAddresses, setCreatedAddresses] = useState<string[]>([]);

  const stageHeaders = ['Staged Addresses', ''];
  const alignments: Array<'r' | 'c' | 'l'> = ['l', 'c'];
  const stageColumns = [
    (address: string) => <Sub>{address}</Sub>,
    (address: string, i: number) => (
      <div style={jcSpaceEvenly}>
        <Btn
          onClick={() => {
            () => setStagedAddresses(stagedAddresses.splice(i, 1));
          }}
        >
          ✓
        </Btn>{' '}
        <Btn
          onClick={() => {
            () => setStagedAddresses(stagedAddresses.splice(i, 1));
          }}
        >
          X
        </Btn>
      </div>
    ),
  ];

  function StagedAddresses({ config }: LobbiesPaneProps) {
    return stagedAddresses && stagedAddresses.length > 0 ? (
      <TableContainer>
        <Table
          paginated={true}
          rows={stagedAddresses || []}
          headers={stageHeaders}
          columns={stageColumns}
          alignments={alignments}
        />
      </TableContainer>
    ) : (
      <Sub>No addresses staged</Sub>
    );
  }

  const whitelistedHeaders = ['Whitelisted Addresses'];
  const whitelistedColumns = [(address: string) => <Sub>{address}</Sub>];
  function WhitelistedAddresses({ config }: LobbiesPaneProps) {
    return stagedAddresses && stagedAddresses.length > 0 ? (
      <TableContainer>
        <Table
          paginated={true}
          rows={stagedAddresses || []}
          headers={whitelistedHeaders}
          columns={whitelistedColumns}
          alignments={alignments}
        />
      </TableContainer>
    ) : (
      <Sub>No addresses whitelisted</Sub>
    );
  }

  function updateAddress() {
    return (
      <TextInput
        style={{ width: '100%' } as CSSStyleDeclaration & React.CSSProperties}
        value={address}
        onChange={(e: Event & React.ChangeEvent<DarkForestTextInput>) => {
          setAddress(e.target.value);
        }}
      />
    );
  }

  let whitelistElems;
  if (stagedAddresses) {
    whitelistElems = <Row>{updateAddress()}</Row>;
  }

  return (
    <>
      <Row>
        <Checkbox
          label='Is whitelist enabled?'
          checked={config.WHITELIST_ENABLED.displayValue}
          onChange={(e: Event & React.ChangeEvent<DarkForestCheckbox>) =>
            onUpdate({ type: 'WHITELIST_ENABLED', value: e.target.checked })
          }
        />
      </Row>
      {config.WHITELIST_ENABLED.displayValue && (
        <>
          <span>Enter a 0x-prefixed address to stage</span>

          {whitelistElems}
          <Btn
            onClick={() => {
              setStagedAddresses([...stagedAddresses, address]);
              setAddress(defaultAddress);
            }}
          >
            Stage Address
          </Btn>
          <Row>
            <Warning>{config.ADMIN_PLANETS.warning}</Warning>
          </Row>
          <br />
          <Row>
            <StagedAddresses config={config} onUpdate={onUpdate} />
          </Row>
          {stagedAddresses.length > 0 && <Btn style={jcFlexEnd}>Add all</Btn>}
          <Row>
            <WhitelistedAddresses config={config} onUpdate={onUpdate} />
          </Row>
        </>
      )}
    </>
  );
}
