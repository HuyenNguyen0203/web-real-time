import * as React from 'react';
import { Dropdown, Menu } from 'semantic-ui-react';
import { ShapeTypes, ShapeTypesLabel } from '../../../constants/enums';

interface LeftMenuProps {
  handleAddShape: Function;
}
const LeftMenu = (props: LeftMenuProps) => {
  const [activeItem, setActiveItem] = React.useState('account');

  const handleItemClick = (e: any) => {
    setActiveItem(e.name);
  };
  return <>
    <div className='shape-slider-menu'>
      <Menu secondary vertical>
        <div className='shape-logo'>
          <a href="/"><h1>Shape</h1></a>
        </div>
        <Menu.Item
          name='account'
          active={activeItem === 'account'}
          onClick={handleItemClick}
        />
        <Menu.Item
          name='settings'
          active={activeItem === 'settings'}
          onClick={handleItemClick}
        />
        <Dropdown item text='Add Shape'>
          <Dropdown.Menu>
            {
              Object.values(ShapeTypes).map((l) => {
                if (Number.isInteger(Number(l))) {
                  return <Dropdown.Item value={l} onClick={() => props.handleAddShape(l)}>{ShapeTypesLabel.get(Number(l))}</Dropdown.Item>;
                }
              })
            }
          </Dropdown.Menu>
        </Dropdown>
      </Menu>
    </div>
  </>;
};

export default LeftMenu;
