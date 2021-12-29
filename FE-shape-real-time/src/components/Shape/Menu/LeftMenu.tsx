import React, {useState} from 'react';
import { Menu } from 'semantic-ui-react';
import { ShapeTypesLabel } from '../../../constants/enums';
import imgUrl from '../../../assets/images/triangle-a.png';

interface LeftMenuProps {
  handleAddShape: Function;
}
const LeftMenu = (props: LeftMenuProps) => {
  const [activeItem, setActiveItem] = useState(null);

  const handleItemClick = (e: any, data: any) => {
    setActiveItem(data.value);
    props.handleAddShape(data.value);
  };
  return <>
    <div className='shape-slider-menu'>
      <div className='shape-logo'>
        <a href="/"><h1>Shape</h1></a>
      </div>
      <Menu fluid vertical tabular>
        {
          ShapeTypesLabel?.map(({ value, text, icon }, index) => {
            let iconProps: string | any = icon;
            if (!icon) {
              iconProps = { as: () => <img src={imgUrl} /> };
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
