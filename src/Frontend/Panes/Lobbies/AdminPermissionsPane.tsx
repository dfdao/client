import React from 'react';
import { Checkbox, DarkForestCheckbox } from '../../Components/Input';
import { Row } from '../../Components/Row';
import { LobbiesPaneProps, Warning } from './LobbiesUtils';

export function AdminPermissionsPane({ config, onUpdate }: LobbiesPaneProps) {
  const checkboxes = [];
  return (
    <>
      <Row>
        <Checkbox
          label='Admin disabled?'
          checked={config.NO_ADMIN.displayValue}
          onChange={(e: Event & React.ChangeEvent<DarkForestCheckbox>) =>
            onUpdate({ type: 'NO_ADMIN', value: e.target.checked })
          }
        />
      </Row>
      <Row>
        <Warning>{config.NO_ADMIN.warning}</Warning>
      </Row>

      {/* <Row>
        <Checkbox
          label='Admin can add planets?'
          checked={config.ADMIN_CAN_ADD_PLANETS.displayValue}
          onChange={(e: Event & React.ChangeEvent<DarkForestCheckbox>) =>
            onUpdate({ type: 'ADMIN_CAN_ADD_PLANETS', value: e.target.checked })
          }
        />
      </Row> */}
      {/* <Row>
        <Warning>{config.ADMIN_CAN_ADD_PLANETS.warning}</Warning>
      </Row> */}
      {/* <Row>
        <Checkbox
          label='Allowlist enabled?'
          checked={config.WHITELIST_ENABLED.displayValue}
          onChange={(e: Event & React.ChangeEvent<DarkForestCheckbox>) =>
            onUpdate({ type: 'WHITELIST_ENABLED', value: e.target.checked })
          }
        />
      </Row> */}
      {/* <Row>
        <Warning>{config.WHITELIST_ENABLED.warning}</Warning>
      </Row> */}
      <Row>
        <Checkbox
          label='Ranked match?'
          checked={config.RANKED.displayValue}
          onChange={(e: Event & React.ChangeEvent<DarkForestCheckbox>) =>
            onUpdate({ type: 'RANKED', value: e.target.checked })
          }
        />
      </Row>
      <Row>
        <Warning>{config.RANKED.warning}</Warning>
      </Row>
    </>
  );
}
