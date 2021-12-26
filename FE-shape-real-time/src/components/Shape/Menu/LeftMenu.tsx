import * as React from 'react';
import { Dropdown, Menu } from 'semantic-ui-react';
import { ShapeTypesLabel } from '../../../constants/enums';

interface LeftMenuProps {
  handleAddShape: Function;
}
const LeftMenu = (props: LeftMenuProps) => {
  const [activeItem, setActiveItem] = React.useState(null);

  const handleItemClick = (e: any, data: any) => {
    setActiveItem(data.value);
    props.handleAddShape(data.value);
  };
  return <>
    <div className='shape-slider-menu'>
      <Menu secondary vertical>
        <div className='shape-logo'>
          <a href="/"><h1>Shape</h1></a>
        </div>
        {
          ShapeTypesLabel?.map(({ value, text, icon }, index) => {
            let iconProps: string | any = icon;
            if (!icon) {
              iconProps = { as: () => <img src={require('../../../assets/images/triangle-a.png')} /> };
            }
            return <Menu.Item
              key={'shape-type-' + index}
              value={value}
              icon={iconProps}
              name={text}
              onClick={handleItemClick}
              active={activeItem == value.toString()}
            />;
          })
        }
      </Menu>
    </div>
  </>;
};

export default LeftMenu;
