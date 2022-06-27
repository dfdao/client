import React from 'react';
import { Checkbox, DarkForestCheckbox } from '../../Components/Input';
import { Row } from '../../Components/Row';
import { LobbiesPaneProps, Warning } from './LobbiesUtils';

export function AdminPermissionsPane({ config, onUpdate }: LobbiesPaneProps) {
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
      <Row>
        <Checkbox
          label='Admin can add planets?'
          checked={config.ADMIN_CAN_ADD_PLANETS.displayValue}
          onChange={(e: Event & React.ChangeEvent<DarkForestCheckbox>) =>
            onUpdate({ type: 'ADMIN_CAN_ADD_PLANETS', value: e.target.checked })
          }
        />
      </Row>
      <Row>
        <Warning>{config.ADMIN_CAN_ADD_PLANETS.warning}</Warning>
      </Row>
      <Row>
        <Checkbox
          label='Is allowlist enabled?'
          checked={config.WHITELIST_ENABLED.displayValue}
          onChange={(e: Event & React.ChangeEvent<DarkForestCheckbox>) =>
            onUpdate({ type: 'WHITELIST_ENABLED', value: e.target.checked })
          }
        />
      </Row>
      <Row>
        <Warning>{config.WHITELIST_ENABLED.warning}</Warning>
      </Row>
      <Row>
        <Checkbox
          label='Ranked'
          checked={config.RANKED.displayValue}
          onChange={(e: Event & React.ChangeEvent<DarkForestCheckbox>) =>
            onUpdate({ type: 'RANKED', value: e.target.checked })
          }
        />
      </Row>
      <Row>
        <Warning>{config.RANKED.warning}</Warning>
      </Row>
      <Row>
        <Checkbox
          label='Confirm Start'
          checked={config.CONFIRM_START.displayValue}
          onChange={(e: Event & React.ChangeEvent<DarkForestCheckbox>) =>
            onUpdate({ type: 'CONFIRM_START', value: e.target.checked })
          }
        />
      </Row>
      <Row>
        <Warning>{config.CONFIRM_START.warning}</Warning>
      </Row>

    </>
  );
}
